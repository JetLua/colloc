import monitor from './monitor'
import {stage, screen, devicePixelRatio} from '~/core'

let btn: PIXI.Sprite

function init() {
  btn = PIXI.Sprite.from('ui.icon.back.png')
  const {top, height, right} = wx.getMenuButtonBoundingClientRect()

  btn.interactive = true

  btn.on('pointerdown', () => {
    monitor.emit('scene:back')
  })

  btn.position.set(
    (screen.width - right * devicePixelRatio) + btn.width / 2,
    (top + height / 2) * devicePixelRatio
  )

  stage.addChild(btn)
}

export function show() {
  if (!btn) init()
  else btn.visible = true
  return btn
}

export function hide() {
  btn.visible = false
}
