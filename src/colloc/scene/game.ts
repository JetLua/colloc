import levels from '../level'
import {stage, screen} from '~/core'
import {align} from '~/util'

const width = 1440
const height = 2560
const hitArea = new PIXI.Circle(0, 0, 52)
const rect = new PIXI.Rectangle()
const clickableIds = ['blue.png', 'green.png', 'pink.png']
const singleIds = [
  'gear.png', 'ring.png', 'arrow.down.png',
  'arrow.up.png', 'arrow.left.png', 'arrow.right.png'
]

let scene: PIXI.Container
let area: PIXI.Container
let startBtn: PIXI.AnimatedSprite
let endBtn: PIXI.Sprite

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
  startBtn.animationSpeed = .1

  startBtn.play()
  startBtn.on('pointerdown', start)
  startBtn.addChild(PIXI.Sprite.from('item.start.core.png'))
  area.addChild(startBtn)


  endBtn = PIXI.Sprite.from('item.end.png')
  area.addChild(endBtn)

  scene.addChild(area)
}

function layout(data: typeof levels[number][number]) {
  const {start, end, baffles} = data

  endBtn.position.copyFrom(end)
  startBtn.position.copyFrom(start)

  for (const item of baffles) {
    let baffle: PIXI.Sprite | PIXI.AnimatedSprite
    if (singleIds.includes(item.frame)) {

    } else {
      const frames = Array.from({length: 31}, (_, i) => `item.${item.frame.replace('.png', `.${i + 1}.png`)}`)
      baffle = PIXI.AnimatedSprite.fromFrames(frames)
      baffle.scale.set(2)
      baffle.angle = item.angle
      baffle.position.copyFrom(item)
      area.addChild(baffle)
    }

    baffle.interactive = clickableIds.includes(item.frame)
    baffle.interactive && (baffle.hitArea = hitArea)
  }

  area.getBounds(false, rect)

  align({target: area})
}

function start() {

}

export function show(grade: number, level: number) {
  if (!scene) init()
  const data = levels[grade][level]
  layout(data)
}

export function hide() {

}

interface Options {
  level: number
}
