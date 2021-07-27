import {store} from '~/util'
import {Design} from './enum'

const width = 150
const height = 690

const colors = ['blue', 'pink', 'yellow', 'setting']
const items: PIXI.Sprite[] = []
let menu: PIXI.Graphics

function init() {
  menu = new PIXI.Graphics()
    .beginFill(0xffcc33, 0)
    .drawRect(0, 0, width, height)
    .endFill()

  menu.interactive = true
  menu.pivot.set(width / 2, height / 2)
  menu.scale.set(Design.Scale)


  colors.forEach((id, i) => {
    const item = PIXI.Sprite.from(`ui.circle.${id}.png`)
    item.x = 75
    item.name = id
    item.y = i * 180 + 75
    item.interactive = true
    items.push(item)
    menu.addChild(item)
  })
}

export function show(opts?: {parent: PIXI.Container}) {
  if (!menu) init()
  update()
  menu.visible = true
  return menu
}

export function update() {
  const {colloc: {level}} = store
  const j = level / 25 | 0
  items.forEach((item, i) => {
    if (i > 2) return
    const active = i <= j
    item.interactive = active
    item.texture = PIXI.Texture.from(`ui.circle.${active ? colors[i] : 'lock'}.png`)
  })
}
