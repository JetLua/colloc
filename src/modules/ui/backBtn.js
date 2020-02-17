import {screen, monitor, stage} from '../../core'
import * as sound from '../sound'

export default {
  init() {
    const btn = PIXI.Sprite.from('icon.back.png')
    this.btn = btn
    btn.zIndex = 3
    btn.tint = 0x8799a3
    btn.hitArea = new PIXI.Circle(0, 0, 50)
    btn.interactive = true
    btn.on('tap', () => {
      sound.play({name: 'back.mp3'})
      monitor.emit('scene:back')
    })

    GameGlobal.interaction.then(rect => {
      btn.position.set(
        screen.width - rect.right * 2 + btn.width / 2,
        rect.height + rect.top * 2,
      )
    })

    stage.addChild(btn)
  },

  show() {
    if (this.btn) return this.btn.visible = true
    this.init()
  },

  hide() {
    this.btn.visible = false
  },
}