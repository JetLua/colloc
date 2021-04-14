import * as PIXI from 'pixi.js'
import * as core from '~/core'

// 子包共享
window._core = core
window._pixi = PIXI

const square = new PIXI.Graphics()
  .beginFill(0xffcc33)
  .drawRect(0, 0, 100, 100)
  .endFill()

square.interactive = true
square.on('tap', () => {
  wx.loadSubpackage({name: 'colloc', success: () => square.visible = false})
})

core.stage.addChild(square)
