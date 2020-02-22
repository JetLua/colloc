import {stage, screen, renderer, zoom} from '../../../core'
import {store, sound} from '../../../modules'
import {tween} from 'popmotion'

const r = 160
const {cos, sin, PI, min} = Math
const PI2 = PI * 2
const PI_2 = PI / 2

let step = 4

export default {
  init() {
    const shadow = new PIXI.Graphics()
    const menu = PIXI.Sprite.from('btn.menu.png')

    this.menu = menu
    this.shadow = shadow

    if (store.setting.voice && store.setting.music) step = 1
    else if (store.setting.voice) step = 2
    else if (store.setting.music) step = 3

    shadow
      .beginFill(0xffcc33, 0)
      .drawRect(0, 0, 60, 60)
      .endFill()

    shadow.zIndex = 3
    shadow.pivot.set(30)
    shadow.position.set(screen.width / 2, screen.height - 80)
    shadow.scale.set(min(zoom.min, 1))
    shadow.addChild(menu)

    menu.interactive = true
    menu.position.set(30)

    this.items = [
      `btn.voice.${step}.png`,
      'btn.hint.png',
      'btn.replay.png',
      'btn.chart.png'
    ].map((item, i) => {
      item = PIXI.Sprite.from(item)
      item.alpha = 0
      item.index = i
      item.type = 'menu:btn'
      item.interactive = true
      item.scale.set(0)
      shadow.addChild(item)
      return item
    })

    stage.addChild(shadow)
    this.listen()
  },

  on(...args) {
    this.shadow.on(...args)
    return this
  },

  open() {
    const {items, shadow} = this
    const delta = PI / (items.length - 1)
    shadow.interactive = false
    this.opened = true
    items.forEach((child, i) => {
      const rotation = -PI + delta * i
      tween({
        duration: 2e2 + i * 50,
        from: {x: 30, y: 30, scale: 0, alpha: 0},
        to: {
          x: cos(rotation) * r + 30,
          y: sin(rotation) * r + 30,
          scale: .8,
          alpha: 1
        }
      }).start({
        update: v => {
          child.alpha = v.alpha
          child.scale.set(v.scale)
          child.position.copyFrom(v)
        },

        complete: () => {
          if (i !== items.length - 1) return
          shadow.interactive = true
        }
      })
    })
  },

  close() {
    const {shadow, items} = this
    shadow.interactive = false
    this.opened = false
    items.forEach((child, i) => {
      tween({
        duration: 2e2 + i * 50,
        from: {x: child.x, y: child.y, scale: .8, alpha: 1},
        to: {
          x: 30,
          y: 30,
          scale: 0,
          alpha: 0
        }
      }).start({
        update: v => {
          child.alpha = v.alpha
          child.scale.set(v.scale)
          child.position.copyFrom(v)
        },

        complete: () => {
          if (i !== items.length - 1) return
          shadow.interactive = true
        }
      })
    })
  },

  listen() {
    const {menu, shadow} = this
    renderer.plugins.interaction.on('tap', ev => {
      if (!this.shadow.visible) return
      const {target} = ev
      if (!target || target.parent !== shadow) {
        if (this.opened) {
          this.close()
          tween({
            from: menu.rotation,
            to: menu.rotation - PI_2
          }).start(v => menu.rotation = v)
        }
        return
      }
      if (target === menu) {
        tween({
          from: menu.rotation,
          to: menu.rotation + PI_2 * (this.opened ? -1 : 1)
        }).start(v => menu.rotation = v)
        this.opened ? this.close() : this.open()
      } else {
        switch (target.index) {
          case 0: {
            step > 3 ? step = 1 : step++
            store.setting.music = store.setting.voice = false
            if (step === 1) store.setting.music = store.setting.voice = true
            else if (step === 2) store.setting.voice = true
            else if (step === 3) store.setting.music = true

            store.setting.music && sound.bgm.paused && sound.bgm.resume()
            !store.setting.music && !sound.bgm.paused && sound.bgm.pause()

            let ok
            target.interactive = false
            tween({
              from: target.rotation,
              to: target.rotation - PI2
            }).start({
              update: v => {
                target.rotation = v
                if (v > -PI || ok) return
                ok = true
                target.texture = PIXI.Texture.from(`btn.voice.${step}.png`)
              },

              complete: () => {
                target.rotation = 0
                target.interactive = true
              }
            })
            break
          }

          case 1: {
            shadow.emit('hint')
            tween({
              from: target.rotation,
              to: target.rotation + PI2
            }).start(v => target.rotation = v)
            break
          }

          case 2: {
            shadow.emit('replay')
            tween({
              from: target.rotation,
              to: target.rotation + PI2
            }).start(v => target.rotation = v)
            break
          }

          case 3: {
            shadow.emit('chart')
            tween({
              from: target.rotation,
              to: target.rotation + PI2
            }).start(v => target.rotation = v)
            break
          }
        }
      }

    })
  },

  render() {
    step = 4
    if (store.setting.voice && store.setting.music) step = 1
    else if (store.setting.voice) step = 2
    else if (store.setting.music) step = 3
    this.shadow.children[1].texture = PIXI.Texture.from(`btn.voice.${step}.png`)
  },

  show() {
    if (this.shadow) {
      this.shadow.visible = true
      return this.render()
    }
    this.init()
  },

  hide() {
    this.opened && this.close()
    this.shadow.visible = false
  }
}
