import levels from '../level'
import {stage, screen, ticker, tick} from '~/core'
import {align, store} from '~/util'
import {animate, linear} from 'popmotion'
import {head, monitor} from '../module'

const width = 1440
const height = 2560
const hitArea = new PIXI.Circle(0, 0, 52)
const sharedPoint = new PIXI.Point()
const pool: PIXI.Sprite[] = []
const clickableIds = ['blue.png', 'green.png', 'pink.png']
const singleIds = [
  'gear.png', 'ring.png', 'arrow.down.png',
  'arrow.up.png', 'arrow.left.png', 'arrow.right.png'
]



let speed = 14
let started = false
let baffles: IBaffle[] = []

let grade: number
let level: number
let last: PIXI.Point
let ball: PIXI.Sprite
let endBtn: PIXI.Sprite
let area: PIXI.Container
let scene: PIXI.Container
let startBtn: PIXI.AnimatedSprite

function init() {
  scene = new PIXI.Container()
  stage.addChild(scene)

  area = new PIXI.Container
  area.scale.set(Math.min(screen.width / width, screen.height / height))

  startBtn = PIXI.AnimatedSprite.fromFrames([
    'item.start.1.png',
    'item.start.2.png',
    'item.start.3.png',
    'item.start.4.png',
    'item.start.5.png',
    'item.start.4.png',
    'item.start.3.png',
    'item.start.2.png'
  ])
  startBtn.interactive = true
  startBtn.zIndex = 3
  startBtn.animationSpeed = .1

  startBtn.play()
  startBtn.on('pointerdown', start)
  startBtn.addChild(PIXI.Sprite.from('item.start.core.png'))
  area.addChild(startBtn)


  endBtn = PIXI.Sprite.from('item.end.png')
  area.addChild(endBtn)

  ball = PIXI.Sprite.from('item.ball.png')
  ball.visible = false
  ball.zIndex = 2
  area.addChild(ball)

  monitor.on('game:retry', () => {
    ticker.remove(update)
    reset()
  })

  scene.addChild(area)
}

function layout(data: typeof levels[number][number]) {
  const {start, end} = data

  endBtn.position.copyFrom(end)
  startBtn.position.copyFrom(start)

  for (const item of data.baffles) {
    let baffle: IBaffle
    if (singleIds.includes(item.frame)) {
      baffle = PIXI.Sprite.from(`item.${item.frame}`) as any
    } else {
      const frames = Array.from({length: 31}, (_, i) => `item.${item.frame.replace('.png', `.${i + 1}.png`)}`)
      baffle = PIXI.AnimatedSprite.fromFrames(frames)
      baffle.scale.set(2)
      baffle.loop = false
    }

    const clickable = clickableIds.includes(item.frame)

    if (clickable) {
      baffle.hitArea = hitArea
      baffle.interactive = clickable
      baffle.on('pointerdown', () => {
        baffle.interactive = false
        animate({
          from: baffle.angle,
          to: baffle.angle + 90,
          duration: 2e2,
          onUpdate: v => baffle.angle = v,
          onComplete: () => baffle.interactive = true
        })
      })
    }

    if (item.frame === 'ring.png') {
      const action = animate({
        from: 0,
        to: Math.PI * 2,
        repeat: Infinity,
        repeatType: 'loop',
        duration: 3e3,
        ease: linear,
        onUpdate: v => baffle.destroyed ? action.stop() : baffle.rotation = v
      })
    }

    if (item.angle != null) {
      baffle.angle =
      baffle.defaultAngle = item.angle
    }

    baffle.position.copyFrom(item)
    baffle.collidable = true
    baffle.name = item.frame
    baffles.push(baffle)
    area.addChild(baffle)

  }

  align({target: area})
}

function start() {
  if (started) return

  started = true
  last = null

  ball.angle = 270
  ball.position.copyFrom(startBtn.position)
  ball.visible = true
  ball.scale.set(1)

  for (const baffle of baffles) {
    baffle.interactive = false
  }

  ticker.add(update)
}

function update() {
  ball.x += Math.cos(ball.rotation) * speed
  ball.y += Math.sin(ball.rotation) * speed

  trail()

  // win
  if (distance(ball, endBtn) <= speed) return win()

  // out
  ball.getGlobalPosition(sharedPoint)

  if (!screen.contains(sharedPoint.x, sharedPoint.y)) return fail()

  for (const baffle of baffles) {
    if (!baffle.collidable || !baffle.visible) continue

    const d = distance(ball, baffle)

    if (d <= speed && !baffle.responding) {
      baffle.responding = true
      respond(ball, baffle)
    } else if (d > 52) {
      baffle.responding = false
    }
  }

}

function reset() {
  started = false

  ball.visible = false

  for (const baffle of baffles) {
    baffle.visible = true
    baffle.collidable = true
    baffle.defaultAngle != null && (baffle.angle = baffle.defaultAngle)
    baffle.interactive = clickableIds.includes(baffle.name)
    baffle instanceof PIXI.AnimatedSprite && baffle.gotoAndStop(0)
  }
}

function respond(ball: PIXI.Sprite, baffle: IBaffle) {
  ball.position.copyFrom(baffle)

  baffle instanceof PIXI.AnimatedSprite && baffle.gotoAndPlay(0)

  if (baffle.name === 'gear.png' || baffle.name === 'pink.png' || baffle.name === 'blue.png') {
    const p = normalize(baffle.angle) % 180
    const q = normalize(ball.angle)
    if (p === 45) q / 90 % 2 ? ball.angle += 90 : ball.angle -= 90
    else q / 90 % 2 ? ball.angle -= 90 : ball.angle += 90
  } else if (baffle.name === 'green.png') {
    const p = normalize(baffle.angle)
    const q = normalize(ball.angle)

    let delta = p - q

    if (Math.abs(delta) !== 45 && delta !== 315) {
      delta < 0 && (delta += 360)
      delta %= 180
      delta === 135 ? ball.angle += 90 :
      delta === 45 ? ball.angle -= 90 : 0
    }
  } else if (baffle.name === 'ring.png') {
    const next = baffles.find(item => item.name === 'ring.png' && item !== baffle)
    next.responding = true
    ball.position.copyFrom(next)
  } else if (baffle.name === 'triangle.png') {
    const p = normalize(baffle.angle)
    const q = normalize(ball.angle)

    let delta = p - q

    if (delta === 0 || delta === -90 || delta === 270) ball.angle += 180
    else if (delta === 90 || delta === -270) ball.angle += 90
    else ball.angle -= 90
  } else ball.angle += 180

  // 道具效果
  if (baffle.name === 'gear.png') {
    const action = animate({
      from: baffle.angle,
      to: baffle.angle + 90,
      onUpdate: v => baffle.destroyed ? action.stop() : baffle.angle = v
    })
  } else if (baffle.name === 'ring.png') {

  } else if (baffle.name === 'green.png') {

  } else if (baffle.name === 'pink.png' || baffle.name === 'square.once.png') {
    baffle.collidable = false
    baffle.onComplete = () => baffle.visible = false
  } else if (baffle.name.startsWith('arrow')) {
    const tx = baffle.name === 'arrow.left.png' ? -200 :
      baffle.name === 'arrow.right.png' ? 200 : 0
    const ty = baffle.name === 'arrow.up.png' ? -200 :
      baffle.name === 'arrow.down.png' ? 200 : 0

    const action = animate({
      from: {x: baffle.x, y: baffle.y},
      to: {x: baffle.x + tx, y: baffle.y + ty},
      duration: 3e2,
      onUpdate: v => baffle.destroyed ? action.stop() : baffle.position.copyFrom(v)
    })
  }
}

function next() {
  level++

  if (level > 24) {
    level = 0
    grade++
  }

  store.colloc.level = grade * 25 + level

  if (grade > 2) {
    wx.showToast({title: '恭喜你，通关啦', icon: 'none'})
    monitor.emit('entry')
    store.colloc.level = 75
    return
  }


  clear()

  layout(levels[grade][level])

  started = false
}

function clear() {
  for (const baffle of baffles) baffle.destroy({children: true})
  baffles = []
}

function fail() {
  ticker.remove(update)
  reset()
}

function win() {
  ticker.remove(update)

  ball.position.copyFrom(endBtn)

  animate({
    to: [1, 3, 0],
    offset: [0, .5, 1],
    duration: 5e2,
    onUpdate: v => ball.scale.set(v),
    onComplete: next
  })
}

/** 尾拖效果 */
function trail() {
  if (!last) return last = ball.position.clone()
  if (distance(ball, last) < 34) return

  const shadow = pool.pop() || PIXI.Sprite.from('item.trail.png')
  shadow.alpha = 1
  shadow.zIndex = 1
  shadow.position.copyFrom(last)
  ball.parent.addChild(shadow)

  last.copyFrom(ball)

  animate({
    from: 1,
    to: 0,
    duration: 5e2,
    onUpdate: v => shadow.alpha = v,
    onComplete: () => {
      shadow.parent.removeChild(shadow)
      pool.push(shadow)
    }
  })
}

function normalize(angle: number) {
  angle = Math.round(angle) % 360
  return angle < 0 ? angle + 360 : angle
}

function distance(p: PIXI.IPointData, q: PIXI.IPointData) {
  return Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2)
}

export function show(_grade: number, _level: number) {
  grade = _grade
  level = _level

  !scene && init()
  scene.visible = true
  const data = levels[grade][level]
  layout(data)
  head.show({backBtn: true, retryBtn: true})
}

export function hide() {
  scene.visible = false
  clear()
  head.hide()
}

interface IBaffle extends PIXI.Sprite, PIXI.AnimatedSprite {
  collidable?: boolean
  responding?: boolean
  defaultAngle?: number
}
