import {stage} from '~/core'
import {animate} from 'popmotion'

const square = new PIXI.Graphics()
  .beginFill(0xffcc33)
  .drawRect(0, 0, 100, 100)
  .endFill()

square.position.set(100)
stage.addChild(square)
square.interactive = true
square.on('tap', () => {
  console.log(animate)
  wx.showToast({title: 'ok'})
})
