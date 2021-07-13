import {stage, screen} from '~/core'
import {store} from '~/util'
import {Color} from '../module'

const width = 500
const height = 500
const r = 100

let scene: PIXI.Container

const grid = new PIXI.Graphics()
  .beginFill(0xffffff, 0)
  .drawRect(0, 0, width, height)
  .endFill()

for (let i = 0; i < 25; i++) {
  const x = i % 5
  const y = i / 5 | 0

  const txt = new PIXI.Text(`${i + 1}`, {
    fontFamily: window.font,
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

function init(grade: Grade) {
  scene = new PIXI.Container()
  stage.addChild(scene)

  grid.pivot.set(width / 2, height / 2)
  grid.position.set(screen.width / 2, screen.height / 2)

  update(grade)
  scene.addChild(grid)
}

function update(grade: Grade = 1) {
  for (let i = 0; i < 25; i++) {
    const j = i * grade
    const txt = grid.children[i] as PIXI.Text
    const ok = j <= store.colloc.level
    txt.text =  ok ? `${j + 1}` : ''
    if (ok) {
      txt.text = `${j + 1}`
      txt.children[0].visible = false
    } else {
      txt.text = ''
      const dot = txt.children[0] as PIXI.Sprite
      dot.visible = true
      dot.texture = PIXI.Texture.from(`ui.dot.${['blue', 'pink', 'yellow'][grade - 1]}.png`)
    }
  }
}

export function show(opts: {grade?: Grade} = {}) {
  if (!scene) return init(opts.grade)
  update(opts.grade)
}

export function hide() {

}

type Grade = 1 | 2 | 3
