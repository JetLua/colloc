import {loader, monitor} from '../core'
import store from './store'

const
  {setting} = store,
  container = new PIXI.Container(),
  layout = new PIXI.Layout({
    col: 2,
    type: PIXI.Layout.GRID,
  })

loader.onComplete.add(() => {
  const hitArea = new PIXI.Circle(0, 0, 50)
  ![
    setting.music ? 'music' : 'music.off',
    setting.voice ? 'voice' : 'voice.off',
    'favor', 'share'
  ].forEach((id, i) => {
    const
      item = new PIXI.Graphics(),
      icon = PIXI.Sprite.from(`setting.${id}.png`)

    item
      .beginFill(0xffcc33, 0)
      .drawCircle(0, 0, 100)
      .endFill()

    icon.name = id
    icon.index = i
    icon.interactive = true
    icon.hitArea = hitArea

    icon.anchor.set(.5)
    item.addChild(icon)
    layout.addChild(item)
  })
})

layout.interactive = true
layout.on('tap', ev => {
  const {target} = ev

  if (target.index === 0) {
    setting.music = !setting.music
    monitor.emit('setting:music', setting.music)
    target.texture = PIXI.Texture.from(`setting.music${setting.music ? '.png' : '.off.png'}`)
  } else if (target.index === 1) {
    setting.voice = !setting.voice
    target.texture = PIXI.Texture.from(`setting.voice${setting.voice ? '.png' : '.off.png'}`)
  } else if (target.index === 2) {
    wx.previewImage({
      urls: ['https://static.lufei.so/image/code.favor.jpg']
    })
  } else {
    monitor.emit('wx:share')
  }
})

container.addChild(layout)

export default container