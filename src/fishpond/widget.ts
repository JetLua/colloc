import * as PIXI from 'pixi.js'

import {screen} from '~/core'

export function show(opts: {parent: PIXI.Container}) {
  // 左边
  ['carbon', 'oxygen'].forEach((id, i, {length}) => {
    const icon = PIXI.Sprite.from(`zero.icon.${id}.png`)
    const half = length / 2 + (length % 2 ? -.5 : .5)

    icon.x = icon.width / 2
    icon.y = screen.height / 2 + icon.height * (i - half) * 1.5

    opts.parent.addChild(icon)
  })

  // 右边
  void ['sum', 'usage'].forEach((id, i, {length}) => {
    const icon = PIXI.Sprite.from(`zero.icon.${id}.png`)
    const half = length / 2 + (length % 2 ? -.5 : .5)

    icon.x = screen.width - icon.width / 2
    icon.y = screen.height / 2 + icon.height * (i - half) * 1.5

    opts.parent.addChild(icon)
  })
}

export function hide() {

}
