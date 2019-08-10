import {stage, screen, device, pixelRatio, monitor, zoom} from '../core'
import {tween, easing} from 'popmotion'
import {sound, store, setting} from '../modules'

const {max, min} = Math

export default {
  init() {
    this.container = new PIXI.Container()
    this.layout = new PIXI.Layout({
      type: PIXI.Layout.VERTICAL,
      gap: 30
    })

    this.back = PIXI.Sprite.from('icon.back.png')
    this.back.tint = 0x8799a3
    this.back.interactive = true
    this.back.zIndex = 3
    this.back.visible = false
    this.back.anchor.set(0, .5)

    store.interaction.then(rect => {
      this.back.y = (rect.top + rect.bottom) * .5 * pixelRatio
      this.back.x = (device.width - rect.right) * pixelRatio
    })

    ![
      'blue',
      store.unlocked > 25 ? 'pink' : 'lock',
      store.unlocked > 50 ? 'yellow' : 'lock',
      // 'custom',
      'setting'
    ].forEach((id, index) => {
      const item = PIXI.Sprite.from(`circle.${id}.png`)
      item.name = id
      item.locked = id === 'lock'
      item.index = index
      item.interactive = true
      this.layout.addChild(item)
    })

    /* 首次进入 */
    if (store.unlocked === 1) {
      const
        cue = PIXI.Sprite.from('circle.cue.png'),
        first = this.layout.children[0]

      cue.alpha = 0
      first.addChild(cue)

      const action = tween({
        from: 0,
        to: 1,
        yoyo: Infinity,
        duration: 6e2,
        ease: easing.linear
      }).start(v => {
        cue._destroyed ? action.stop() : cue.alpha = v
      })
    }

    this.container.interactive = true
    /* 只缩小 不放大 */
    this.layout.scale.set(min(1, zoom.min))
    this.container.addChild(this.layout, this.back)
  },

  addSelector(name) {
    const
      i = name === 'blue' ? 0 : name === 'pink' ? 1 : 2,
      selector = new PIXI.Layout({
        type: PIXI.Layout.GRID,
        col:  5
      }),
      style = {
        fontFamily: store.font,
        fill: [0x529bd1, 0xe0486d, 0xe8a77a][i],
        fontSize: 42
      },

      hitArea = new PIXI.Circle(0, 0, 50)


    for (let k = 0; k < 25; k++) {
      const
        index = i * 25 + k,
        graphics = new PIXI.Graphics()

      if (index < store.unlocked) {
        const text = new PIXI.Text(index + 1, style)
        text.anchor.set(.5)
        graphics.index = index
        graphics.hitArea = hitArea
        graphics.interactive = true
        graphics.addChild(text)
      } else {
        const dot = PIXI.Sprite.from(`dot.${name}.png`)
        dot.anchor.set(.5)
        graphics.addChild(dot)
      }

      graphics.beginFill(0xffcc33, 0).drawCircle(0, 0, 50).endFill()
      selector.addChild(graphics)
    }

    /* 首次进入 */
    if (store.unlocked === 1) {
      const
        first = selector.children[0],
        cue = PIXI.Sprite.from('circle.cue.png')

      cue.alpha = 0
      cue.anchor.set(.5)
      cue.scale.set(first.width / cue.width)
      first.addChild(cue)

      const action = tween({
        from: 0,
        to: 1,
        yoyo: Infinity,
        duration: 6e2,
        ease: easing.linear
      }).start(v => {
        cue._destroyed ? action.stop() : cue.alpha = v
      })
    }

    selector.interactive = true
    selector.on('tap', ev => {
      const {target} = ev
      if (target.index == null) return
      this.hide()
      monitor.emit('scene:go', 'game', target.index)
    }).on('added', () => {
      screen.align(selector)
    })

    selector.scale.copyFrom(this.layout.scale)

    this.back.visible = true
    this.back.once('tap', () => {
      this.back.visible = false
      this.layout.visible = true
      selector.destroy({children: true})
    })

    this.container.addChild(selector)
  },

  addSetting() {
    this.back.visible = true
    this.back.once('tap', () => {
      this.back.visible = false
      this.layout.visible = true
      this.container.removeChild(setting)
    })

    setting.once('added', () => {
      screen.align(setting)
    })

    setting.scale.copyFrom(this.layout.scale)
    this.container.addChild(setting)
  },

  listen() {
    const
      {container, layout} = this

    container
      .on('added', () => {
        screen.align(layout)
      })
      .on('tap', ev => {
        const {target} = ev

        if (!target.name || target.locked || target.parent !== this.layout) return
        store.setting.voice && sound.play('static/sounds/tap.wav')
        if (target.index < 3) {
          this.layout.visible = false
          this.addSelector(target.name)
        } else if (target.name === 'chart') {
          this.addChart()
        } else if (target.name === 'setting') {
          this.layout.visible = false
          this.addSetting()
        } else if (target.name === 'custom') {
          this.hide()
          monitor.emit('scene:go', 'custom')
        }
      })
      .on('pointerdown', ev => {
        const {target} = ev
        if (!target || target.parent !== this.layout) return
        target.tint = 0xbdfade
      })
      .on('pointerup', ev => {
        this.layout.children.forEach(child => child.tint = 0xffffff)
      })
      .on('pointerupoutside', ev => {
        this.layout.children.forEach(child => child.tint = 0xffffff)
      })
  },

  show() {
    this.init()
    this.listen()
    stage.addChild(this.container)
    monitor.emit('scene:show', 'entry')
  },

  hide() {
    this.container.destroy({children: true})
    monitor.emit('scene:hide', 'entry')
  }
}