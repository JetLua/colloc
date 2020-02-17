import {stage, zoom, design, screen, loader, monitor} from '../core'
import {store, sound} from '../modules'
import {backBtn} from '../modules/ui'

const {min} = Math

export default {
  init() {
    const container = new PIXI.Container()
    const layout = new PIXI.Graphics()
    const w = 150

    layout
      .beginFill(0xffcc33, 0)
      .drawRect(0, 0, w, w)
      .endFill()

    layout.interactive = true
    layout.pivot.set(layout.width / 2, layout.height / 2)
    layout.position.set(screen.width / 2, screen.height / 2)
    layout.scale.set(min(zoom.min, 1))

    this.layout = layout
    this.container = container

    const hitArea = new PIXI.Circle(0, 0, 50)
    ![
      `setting.music.${store.setting.music ? 'png' : 'off.png'}`,
      `setting.voice.${store.setting.voice ? 'png' : 'off.png'}`,
      'setting.favor.png',
      'setting.share.png',
    ].forEach((item, i) => {
      item = PIXI.Sprite.from(item)
      item.index = i
      item.hitArea = hitArea
      item.interactive = true
      item.x = (i % 2) * w
      item.y = (i / 2 | 0) * w
      layout.addChild(item)
    })


    container.addChild(layout)
    stage.addChild(container)

    this.listen()
  },

  listen() {
    const {layout} = this
    layout.on('tap', ev => {
      const {target} = ev
      if (!target) return
      switch (target.index) {
        case 0: {
          store.setting.music ^= 1
          store.setting.music && sound.bgm.paused && sound.bgm.resume()
          !store.setting.music && !sound.bgm.paused && sound.bgm.pause()
          target.texture = PIXI.Texture.from(`setting.music.${store.setting.music ? 'png' : 'off.png'}`)
          break
        }

        case 1: {
          store.setting.voice ^= 1
          target.texture = PIXI.Texture.from(`setting.voice.${store.setting.voice ? 'png' : 'off.png'}`)
          break
        }

        case 2: {
          wx.previewImage({
            urls: [`${BASE}/images/favor.jpg`]
          })
          break
        }

        case 3: {
          // todo
          break
        }
      }
    })
  },

  render() {
    const {layout: {children}} = this
    children[0].texture = PIXI.Texture.from(`setting.music.${store.setting.music ? 'png' : 'off.png'}`)
    children[1].texture = PIXI.Texture.from(`setting.voice.${store.setting.voice ? 'png' : 'off.png'}`)
  },

  show() {
    backBtn.show()
    if (this.container) {
      this.container.visible = true
      return this.render()
    }
    this.init()
  },

  hide() {
    backBtn.hide()
    this.container.visible = false
  }
}