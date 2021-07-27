import {stage, screen} from '~/core'
import {store} from '~/util'
import {Color, head, monitor} from '../module'

const width = 500
const height = 500
const r = 100
const hitArea =  new PIXI.Circle(0, 0, 40)

let grade: number
let scene: PIXI.Container

const grid = new PIXI.Graphics()
  .beginFill(0xffffff, 0)
  .drawRect(0, 0, width, height)
  .endFill()

for (let i = 0; i < 25; i++) {
  const x = i % 5
  const y = i / 5 | 0

  const txt = new PIXI.Text(`${i + 1}`, {
    fontSize: 42,
    fill: Color.Blue
  })

  const dot = PIXI.Sprite.from(PIXI.Texture.WHITE)
  dot.anchor.set(.5)
  txt.addChild(dot)

  txt.anchor.set(.5)
  txt.position.set((.5 + x) * r, (.5 + y) * r)

  grid.addChild(txt)
}

function init() {
  scene = new PIXI.Container()
  stage.addChild(scene)

  grid.pivot.set(width / 2, height / 2)
  grid.position.set(screen.width / 2, screen.height / 2)
  grid.interactive = true
  grid.on('pointerdown', (e: IEvent) => {
    const target = e.target
    if (!(target instanceof PIXI.Text)) return
    monitor.emit('scene:go', 'game', grade, (+target.text - 1) % 25)
  })

  update()
  scene.addChild(grid)
}

function update() {
  const colors = [Color.Blue, Color.Pink, Color.Yellow]
  for (let i = 0; i < 25; i++) {
    const j = i + grade * 25
    const txt = grid.children[i] as PIXI.Text
    const ok = j <= store.colloc.level
    txt.hitArea = hitArea
    txt.style.fontFamily = window.font
    txt.style.fill = colors[grade]
    txt.text =  ok ? `${j + 1}` : ''
    if (ok) {
      txt.interactive = true
      txt.text = `${j + 1}`
      txt.children[0].visible = false
    } else {
      txt.text = ''
      const dot = txt.children[0] as PIXI.Sprite
      dot.visible = true
      dot.texture = PIXI.Texture.from(`ui.dot.${['blue', 'pink', 'yellow'][grade]}.png`)
    }
  }
}

export function show(_grade: number) {
  grade = _grade
  if (!scene) init()
  else update()
  scene.visible = true
  head.show({backBtn: true})
}

export function hide() {
  scene.visible = false
  head.hide()
}
