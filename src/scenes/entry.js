import {store, sound} from '../modules'
import {chart} from '../modules/ui/entry'
import {read, ROOT} from '../modules/wx'
import {tween} from 'popmotion'
import {stage, zoom, design, screen, monitor} from '../core'

const {min} = Math
const {factory} = dragonBones.PixiFactory
const clubButton = wx.createGameClubButton({
  icon: 'white',
  style: {
    left: 10,
    top: screen.height * .2,
    width: 40,
    height: 40
  }
})
clubButton.hide()

export default {
  init() {
    const container = new PIXI.Container()
    const layout = new PIXI.Graphics()

    layout
      .beginFill(0xffcc33, 0)
      .drawRect(0, 0, design.width, design.height)
      .endFill()

    layout.interactive = true
    layout.pivot.set(layout.width / 2, layout.height / 2)
    layout.position.set(screen.width / 2, screen.height / 2)

    ![
      'circle.blue.png',
      `circle.${store.user.level > 24 ? 'pink' : 'lock'}.png`,
      `circle.${store.user.level > 49 ? 'yellow' : 'lock'}.png`,
      'circle.chart.png',
      'circle.setting.png',
    ].forEach((name, i) => {
      const item = PIXI.Sprite.from(name)
      item.index = i
      item.interactive = !name.includes('lock')
      item.x = layout.width / 2
      item.y = layout.height / 2
      tween({
        from: item.y,
        to: item.y + (i - 2) * 180,
        duration: 5e2
      }).start(v => item.y = v)
      layout.addChild(item)
    })

    if (!store.user.level) {
      const anime = factory.buildArmatureDisplay('Armature')
      anime.animation.play('tap')
      layout.children[0].addChild(anime)
      layout.once('tap', ev => {
        const {target} = ev
        target?.index === 0 && anime.destroy({children: true})
      })
    }

    this.layout = layout
    this.container = container
    layout.scale.set(min(zoom.min, 1))

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
        case 0:
        case 1:
        case 2: {
          sound.play({name: 'tap.mp3'})
          monitor.emit('scene:go', 'selector', target.index)
          break
        }

        case 3: {
          chart.show()
          sound.play({name: 'tap.mp3'})
          break
        }

        case 4: {
          sound.play({name: 'tap.mp3'})
          monitor.emit('scene:go', 'setting')
          break
        }
      }
    })
  },

  render() {
    const {layout: {children}} = this
    let ok = store.user.level > 24
    children[1].texture = PIXI.Texture.from(`circle.${ok ? 'pink' : 'lock'}.png`)
    children[1].interactive = ok
    ok = store.user.level > 49
    children[2].texture = PIXI.Texture.from(`circle.${ok ? 'yellow' : 'lock'}.png`)
    children[2].interactive = ok
  },

  show() {
    clubButton.show()
    if (this.container) {
      this.container.visible = true
      return this.render()
    }
    this.init()
  },

  hide() {
    this.container.visible = false
    clubButton.hide()
  }
}