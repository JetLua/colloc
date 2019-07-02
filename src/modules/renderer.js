import {screen, design, loader, ticker} from '../core'
import {tween, easing, everyFrame, chain} from 'popmotion'
import store from './store'
import * as sound from './sound'

const
  {min, PI, sqrt, cos, sin, round, abs} = Math,
  PI2 = PI * 2,
  width = 1440,
  height = 2560,
  ratio = min(
    1,
    min(screen.width, design.width) / width,
    min(screen.height, design.height) / height
  ),
  stage = new PIXI.Graphics()
    .beginFill(0xe0eef5, .1)
    .drawRect(0, 0, 1e3, 2e3)
    .endFill(),
  left = ['blue.png', 'green.png', 'pink.png', 'gear.png', 'triangle.png'],
  right = [
    'ring.png', 'square.png', 'square.once.png',
    'arrow.up.png', 'arrow.down.png', 'arrow.left.png', 'arrow.right.png'
  ],
  bar = {
    left: new PIXI.Layout({type: PIXI.Layout.VERTICAL, gap: 30}),
    right: new PIXI.Layout({type: PIXI.Layout.VERTICAL, gap: 30}),
  },

  site = {},

  pool = []


let
  unused, selected, ball,
  down,  last, baffles,
  mode = 'normal',
  speed = 0

ticker.add(update)

loader.onComplete.add(() => {
  for (const id of left) {
    const
      icon = PIXI.Sprite.from(id),
      item = new PIXI.Graphics().beginFill(0xffffff).drawCircle(0, 0, 100).endFill()

    if (id !== 'triangle.png') {
      icon.angle = 45
      icon.scale.set(.6)
    }

    item.name = id
    item.interactive = true
    icon.anchor.set(.5)
    item.addChild(icon)
    bar.left.addChild(item)
  }

  for (const id of right) {
    const
      icon = PIXI.Sprite.from(id),
      item = new PIXI.Graphics().beginFill(0xffffff).drawCircle(0, 0, 100).endFill()

    id === 'ring.png' ? icon.tint = 0xf8ba86 : 0
    item.name = id
    item.interactive = true
    icon.anchor.set(.5)
    item.addChild(icon)
    bar.right.addChild(item)
  }

  const start = PIXI.AnimatedSprite.fromFrames([
    'start.1.png',
    'start.2.png',
    'start.3.png',
    'start.4.png',
    'start.5.png',
    'start.4.png',
    'start.3.png',
    'start.2.png'
  ])

  start.zIndex = 3
  start.animationSpeed = .1
  start.interactive = true
  start.play()
  start.anchor.set(.5)
  start.position.set(400 + 100, 1800 + 100)

  {
    const arrow = PIXI.Sprite.from('start.core.png')
    arrow.anchor.set(.5)
    start.addChild(arrow)
  }

  const end = PIXI.Sprite.from('end.png')
  end.interactive = true
  end.anchor.set(.5)
  end.position.set(400 + 100, 100)

  ball = PIXI.Sprite.from('ball.png')
  ball.zIndex = 1
  ball.visible = false
  ball.anchor.set(.5)

  site.start = start
  site.end = end

  stage.addChild(start, end, ball)
})

stage.scale.set(ratio)
bar.left.scale.set(ratio)
bar.right.scale.set(ratio)

stage.interactive =
bar.left.interactive =
bar.right.interactive = true

bar.left.on('pointerdown', select)
bar.right.on('pointerdown', select)

stage
  .on('pointerdown', ev => {
    if (mode === 'design') {
      const
        {target, data: {global}} = ev,
        point = toLocal(global)

      down = {...global}

      if (unused && placeable(point)) {
        unused.position.copyFrom(point)
        stage.addChild(unused)
        selected = unused
        unused = null
      }

      if (target !== stage) {
        selected = target
      }
    } else {
      const {target} = ev
      /* 挡板 */
      if (target.type === 'baffle' && target.clickable) {
        target.interactive = false
        const action = tween({
          from: target.angle,
          to: target.angle + 90,
          ease: easing.linear,
          duration: 2e2
        }).start({
          update: v => {
            target._destroyed ? action.stop() : target.angle = v
          },

          complete: () => {
            target.angle %= 360
            target.interactive = true
          }
        })
      } else if (target === site.start) {
        start()
      }
    }
  })
  .on('pointermove', ev => {
    if (mode === 'normal') return
    const
      {target, data: {global}} = ev,
      point = toLocal(global)

    if (!stage.containsPoint(global)) {
      if (selected) {
        selected.destroy()
        selected = null
      }
      return
    }

    if (!placeable(point)) return

    if (unused) {
      unused.position.copyFrom(point)
      stage.addChild(unused)
      selected = unused
      unused = null
    }

    if (selected) {
      selected.position.copyFrom(toLocal(global))
    }
  })
  .on('pointerup', ev => {
    if (mode === 'normal') return

    const {target, data: {global: {x, y}}} = ev

    if (!down || down.x !== x || down.y !== y) return selected = null

    if (selected && selected === site.start) {
      selected = null
      start()
      return
    }

    if (!selected || !selected.clickable) return selected = null

    const tmp = selected
    tmp.clickable = false
    const action = tween({
      from: tmp.angle,
      to: tmp.angle + 90,
      duration: 2e2,
      ease: easing.linear
    }).start({
      update: v => tmp._destroyed ? action.stop() : tmp.angle = v,
      complete: () => tmp.clickable = true
    })

    selected = null

  })

function placeable({x, y}) {
  for (const child of stage.children) {
    if (child.x === x && child.y === y) return
  }
  return true
}

function toLocal(point) {
  point = stage.toLocal(point)
  point.x = (point.x / 200 | 0) * 200 + 100
  point.y = (point.y / 200 | 0) * 200 + 100
  point.x > 1e3 ? point.x -= 200 : 0
  point.y > 2e3 ? point.y -= 200 : 0
  return point
}

function select(ev) {
  const {target} = ev
  if (!target.name) return
  if (target === selected && unused) return
  unused?.destroy()
  unused = create(target.name)
  select = target
}

function create(name) {
  const
    single = [
      'gear.png', 'ring.png', 'arrow.down.png',
      'arrow.up.png', 'arrow.left.png', 'arrow.right.png'
    ],

    clickable = [
      'blue.png', 'green.png', 'pink.png'
    ]

  let baffle

  if (single.indexOf(name) !== -1) {
    baffle = PIXI.Sprite.from(name)
  } else {
    baffle = PIXI.AnimatedSprite
      .fromFrames(Array.from(
        {length: 31},
        (_, i) => name.replace('.png', `.${i + 1}.png`)
      ))

    baffle.loop = false
    baffle.animationSpeed = .6
    baffle.scale.set(2)
  }

  /* ring */
  if (name === 'ring.png') {
    const action = everyFrame().start(() => {
      if (baffle._destroyed) return action.stop()
      baffle.rotation += .02
      baffle.rotation %= PI2
    })
  }

  baffle.clickable = (mode === 'normal' ? clickable : left).indexOf(name) !== -1
  baffle.clickable && name !== 'triangle.png' ? baffle.angle = 45 : 0

  if (baffle.clickable) {
    baffle.hitArea = name === 'gear' ?
      new PIXI.Circle(0, 0, 104) :
      new PIXI.Circle(0, 0, 52)
  }

  baffle.type = 'baffle'
  baffle.name = name
  baffle.collidable =
  baffle.interactive = true
  baffle.anchor.set(.5)

  return baffle
}

function start() {
  if (!check()) return

  const {start} = site
  last = null
  baffles = stage.children.filter(child => {
    if (child.type !== 'baffle') return
    child.prop = {
      angle: child.angle,
      position: child.position.clone()
    }
    return true
  })
  speed = 14
  ball.visible = true
  ball.angle = 270
  ball.scale.set(1)
  ball.position.copyFrom(start.position)
  stage.interactive = false
  stage.emit('started')
}

function win() {
  const {end} = site
  speed = 0
  store.setting.voice && sound.play('static/sounds/win.mp3')

  ball.position.copyFrom(end.position)

  const action = chain(
    tween({from: 1, to: 3}),
    tween({from: 3, to: 0})
  ).start({
    update: v => {
      ball._destroyed ? action.stop() : ball.scale.set(v)
    },

    complete: () => {
      restore()
      stage.emit('ended', true)
    }
  })

}

function fail() {
  speed = 0
  ball.visible = false
  store.setting.voice && sound.play('static/sounds/fail.mp3')
  restore()
  stage.emit('ended', false)
}

function restore() {
  speed = 0
  ball.visible = false
  stage.interactive = true
  baffles.forEach(baffle => {
    const {prop} = baffle
    baffle.visible =
    baffle.collidable = true
    baffle.angle = prop.angle
    baffle.position.copyFrom(prop.position)

    /* for arrow.*.png */
    baffle.action?.stop()

    baffle instanceof PIXI.AnimatedSprite && baffle.gotoAndStop(0)
  })
}

function update() {
  if (!speed) return

  ball.x += cos(ball.rotation) * speed
  ball.y += sin(ball.rotation) * speed

  trail()
  detect()
}

function extract() {
  if (!check()) return
  const
    {start, end} = site,
    conf = {}

  conf.start = {x: start.x, y: start.y}
  conf.end = {x: end.x, y: end.y}
  conf.baffles = baffles.map(baffle => ({
    frame: baffle.name,
    x: baffle.x,
    y: baffle.y,
    angle: baffle.name === 'ring.png' ? 0 : normalize(baffle.angle)
  }))

  return conf
}

function check() {
  baffles = stage.children.filter(child => child.type === 'baffle')
  // check ring
  let count = 0
  baffles.forEach(baffle => baffle.name === 'ring.png' ? count++ : 0)
  if (count % 2) {
    wx.showToast({title: '圆环个数必须是偶数', icon: 'none'})
    return false
  }

  return true
}

/* 碰撞检测 */
function detect() {
  const {end} = site
  /* end */
  if (distance(ball, end) <= speed) return win()

  /* 出界 */
  {
    const {x, y} = ball.getGlobalPosition()
    if (!screen.contains(x, y)) return fail()
  }

  for (const baffle of baffles) {
    if (!baffle.collidable) continue
    const d = distance(ball, baffle)
    if (d <= speed && !baffle.hold) {
      baffle.hold = true
      respond(ball, baffle)
    } else if (d > speed && baffle.hold) {
      baffle.hold = false
    }
  }
}

function respond(ball, baffle) {
  baffle instanceof PIXI.AnimatedSprite && baffle.gotoAndPlay(0)
  ball.position.copyFrom(baffle.position)

  if (baffle.name === 'gear.png' ||
    baffle.name === 'pink.png' ||
    baffle.name === 'blue.png') {
    const
      p = normalize(baffle.angle) % 180,
      q = normalize(ball.angle)

    if (p === 45) {
      q / 90 % 2 ? ball.angle += 90 : ball.angle -= 90
    } else {
      q / 90 % 2 ? ball.angle -= 90 : ball.angle += 90
    }
  } else if (baffle.name === 'green.png') {
    const
      p = normalize(baffle.angle),
      q = normalize(ball.angle)

    let delta = p - q

    if (abs(delta) !== 45 && delta !== 315) {
      delta < 0 ? delta += 360 : 0
      delta %= 180
      delta === 135 ? ball.angle += 90 :
      delta === 45 ? ball.angle -= 90 : 0
    }

  } else if (baffle.name === 'ring.png') {
    const next = baffles.find(item => item.name === 'ring.png' && item !== baffle)
    next.hold = true
    ball.position.copyFrom(next.position)

  } else if (baffle.name === 'square.png' || baffle.name === 'square.once.png' ||
    baffle.name === 'arrow.up.png' || baffle.name === 'arrow.left.png' ||
    baffle.name === 'arrow.down.png' || baffle.name === 'arrow.right.png') {
    ball.angle += 180
  } else if (baffle.name === 'triangle.png') {
    const
      p = normalize(baffle.angle),
      q = normalize(ball.angle)

    let delta = p - q

    if (delta === 0 || delta === -90 || delta === 270) ball.angle += 180
    else if (delta === 90 || delta === -270) ball.angle += 90
    else ball.angle -= 90
  }

  switch (baffle.name) {
    case 'gear.png': {
      const action = tween({
        from: baffle.angle,
        to: baffle.angle + 90
      }).start(v => {
        baffle._destroyed ? action.stop() : baffle.angle = v
      })
      store.setting.voice && sound.play('static/sounds/collide.gear.mp3')
      break
    }

    case 'arrow.up.png':
    case 'arrow.down.png':
    case 'arrow.left.png':
    case 'arrow.right.png': {
      const
        tx = baffle.name === 'arrow.left.png' ? -200 :
          baffle.name === 'arrow.right.png' ? 200 : 0,
        ty = baffle.name === 'arrow.up.png' ? -200 :
          baffle.name === 'arrow.down.png' ? 200 : 0

      const action = tween({
        from: {x: baffle.x, y: baffle.y},
        to: {x: baffle.x + tx, y: baffle.y + ty},
        duration: 3e2,
        ease: easing.linear
      }).start(v => baffle._destroyed ? action.stop() : baffle.position.copyFrom(v))

      baffle.action = action

      store.setting.voice && sound.play('static/sounds/collide.arrow.mp3')
      break
    }

    case 'square.once.png':
    case 'pink.png': {
      baffle.collidable = false
      baffle.onComplete = () => {
        baffle.visible = false
        baffle.shadow ? baffle.shadow.visible = false : 0
      }
      store.setting.voice && sound.play('static/sounds/collide.once.mp3')
      break
    }

    case 'ring.png': {
      store.setting.voice && sound.play('static/sounds/transfer.mp3')
      break
    }

    case 'green.png': {
      store.setting.voice && sound.play('static/sounds/collide.green.mp3')
      break
    }

    default: {
      store.setting.voice && sound.play('static/sounds/collide.mp3')
      break
    }
  }
}

  /* 0 - 360 */
function normalize(angle) {
  angle = round(angle) % 360
  return angle < 0 ? angle + 360 : angle
}

function distance(p, q) {
  return sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2)
}

function trail() {
  if (!last) return last = ball.position.clone()
  if (distance(last, ball) < 30) return

  const dot = pool.pop() || PIXI.Sprite.from('trail.png')

  dot.alpha = 1
  dot.anchor.set(.5)
  dot.position.copyFrom(last)
  ball.parent.addChild(dot)

  last.copyFrom(ball.position)

  const action = tween({
    from: 1,
    to: 0,
    duration: 5e2,
    ease: easing.linear
  }).start({
    update: v => dot._destroyed ? action.stop() : dot.alpha = v,
    complete: () => {
      dot.parent.removeChild(dot)
      pool.push(dot)
    }
  })
}

function clean() {
  site.start.position.set(500, 1900)
  site.end.position.set(500, 100)
  stage.removeListener('started')
  stage.removeListener('ended')
  stage.parent.removeChild(stage)
  bar.left.parent.removeChild(bar.left)
  bar.right.parent.removeChild(bar.right)
  baffles = stage.children.filter(child => child.type === 'baffle')
  while (baffles.length) baffles.pop().destroy({children: true})
}

function render(conf) {
  site.start.position.copyFrom(conf.start)
  site.end.position.copyFrom(conf.end)
  conf.baffles.forEach(item => {
    const baffle = create(item.frame)
    baffle.angle = item.angle
    baffle.position.set(item.x, item.y)
    stage.addChild(baffle)
  })
}

function setMode(state) {
  mode = state
  bar.left.visible =
  bar.right.visible = state === 'design'

  if (state === 'normal') {
    stage.clear()
  } else {
    stage
      .clear()
      .beginFill(0xe0eef5, .1)
      .drawRect(0, 0, 1e3, 2e3)
      .endFill()
  }
}


export {
  bar,
  stage,
  clean,
  render,
  extract,
  restore,
  setMode
}