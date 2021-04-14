import * as PIXI from 'pixi.js'
import {stage} from '~/core'

const square = new PIXI.Graphics()
  .beginFill(0xffcc33)
  .drawRect(0, 0, 100, 100)
  .endFill()

square.position.set(100)
stage.addChild(square)
square.interactive = true
square.on('tap', () => {
  wx.showToast({title: 'ok'})
})
