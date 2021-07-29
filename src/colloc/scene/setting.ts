import {stage, screen, monitor} from '~/core'
import {store} from '~/util'
import {Button, Design, head} from '../module'

let scene: PIXI.Graphics

const width = 280
const height = 280
const hitArea = new PIXI.Circle(0, 0, 60)

function init() {
  scene = new PIXI.Graphics()
    .beginFill(0xffcc33, 0)
    .drawRect(0, 0, width, height)
    .endFill()


  scene.interactive = true
  scene.pivot.set(width / 2, height / 2)
  scene.position.set(screen.width / 2, screen.height / 2)
  scene.scale.set(Design.Scale)

  const ids = ['music', 'voice', 'share', 'favor']

  ids.forEach((id, i) => {
    let _id = id

    if (id === 'music') _id = store.colloc.settings.music ? id : 'music.off'
    else if (id === 'voice') _id = store.colloc.settings.voice ? id : 'voice.off'

    const item = new Button({id: `ui.setting.${_id}.png`, zoom: [1, 1.2]})
    item.name = id
    item.hitArea = hitArea
    item.position.set(70 + 140 * (i % 2), 70 + 140 * (i / 2 | 0))
    scene.addChild(item)
  })

  scene.on('pointerup', (e: IEvent) => {
    const name = e.target?.name
    switch (name) {
      case 'voice': {
        store.colloc.settings.voice ^= 1
        const item = scene.children[1] as PIXI.Sprite
        item.texture = PIXI.Texture.from(`ui.setting.${store.colloc.settings.voice ? 'voice' : 'voice.off'}.png`)
        break
      }

      case 'music': {
        store.colloc.settings.music ^= 1
        const item = scene.children[0] as PIXI.Sprite
        item.texture = PIXI.Texture.from(`ui.setting.${store.colloc.settings.music ? 'music' : 'music.off'}.png`)
        break
      }

      case 'share': {
        wx.shareAppMessage({
          title: [
            '世上无难事，只要肯放弃',
            '不努力一下怎么知道自己真的不行',
            '万事开头难，然后中间难，最后结尾难',
          ][Math.random() * 3 | 0],
          imageUrl: [
            'cloud://dev-3gxm8dpg90392ec0.6465-dev-3gxm8dpg90392ec0-1251004721/texture/share.1.png',
            'cloud://dev-3gxm8dpg90392ec0.6465-dev-3gxm8dpg90392ec0-1251004721/texture/share.2.png',
            'cloud://dev-3gxm8dpg90392ec0.6465-dev-3gxm8dpg90392ec0-1251004721/texture/share.3.png',
            'cloud://dev-3gxm8dpg90392ec0.6465-dev-3gxm8dpg90392ec0-1251004721/texture/share.4.png',
            'cloud://dev-3gxm8dpg90392ec0.6465-dev-3gxm8dpg90392ec0-1251004721/texture/share.5.png',
            'cloud://dev-3gxm8dpg90392ec0.6465-dev-3gxm8dpg90392ec0-1251004721/texture/share.6.png',
          ][Math.random() * 6 | 0]
        })
        break
      }

      case 'favor': {
        wx.previewImage({
          urls: ['cloud://dev-3gxm8dpg90392ec0.6465-dev-3gxm8dpg90392ec0-1251004721/texture/favor.png']
        })
        break
      }
    }
  })

  stage.addChild(scene)
}

export function show() {
  if (!scene) init()
  scene.visible = true
  head.show({backBtn: true})
}

export function hide() {
  scene.visible = false
  head.hide()
}
