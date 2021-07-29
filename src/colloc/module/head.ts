import monitor from './monitor'
import {stage, screen, pixelRatio} from '~/core'
import {Design} from './enum'
import {animate} from 'popmotion'
import Button from './Button'

const width = 56
const gap = 30

let backBtn: PIXI.Sprite
let scene: PIXI.Graphics
let retryBtn: PIXI.Sprite

function init() {
  scene = new PIXI.Graphics()
    .beginFill(0xffcc33, 0)
    .drawRect(0, 0, 2 * width + gap, width)
    .endFill()
  scene.interactive = true
  scene.pivot.set(scene.width / 2, scene.height / 2)
  scene.scale.set(Design.Scale)
  scene.on('pointerup', (e: IEvent) => {
    const target = e.target
    switch (target.name) {
      case 'btn:back': {
        monitor.emit('scene:back')
        break
      }

      case 'btn:retry': {
        target.interactive = false
        monitor.emit('game:retry')
        animate({
          from: target.angle,
          to: target.angle + 360,
          duration: 2e2,
          onUpdate: v => target.angle = v,
          onComplete: () => target.interactive = true
        })
        break
      }
    }
  })

  backBtn = new Button({id: 'ui.icon.back.png', zoom: [1, 1.2]})
  backBtn.interactive = true
  backBtn.name = 'btn:back'
  backBtn.tint = 0x8799a3
  backBtn.position.set(width / 2)
  scene.addChild(backBtn)

  retryBtn = new Button({id: 'ui.icon.retry.png', zoom: [1, 1.2]})
  retryBtn.interactive = true
  retryBtn.name = 'btn:retry'
  retryBtn.tint = 0x8799a3
  retryBtn.position.set(width * 1.5 + gap, width / 2)
  scene.addChild(retryBtn)

  const {top, height, right} = wx.getMenuButtonBoundingClientRect()

  scene.position.set(
    (screen.width - right * pixelRatio) + scene.width / 2,
    (top + height / 2) * pixelRatio
  )

  stage.addChild(scene)
}

export function show(opts: {backBtn?: boolean, retryBtn?: boolean}) {
  if (!scene) init()
  else scene.visible = true

  backBtn.visible = opts.backBtn
  retryBtn.visible = opts.retryBtn

  return scene
}

export function hide() {
  scene.visible = false
}
