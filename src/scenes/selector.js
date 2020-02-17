import {stage, zoom, screen, monitor} from '../core'
import {backBtn} from '../modules/ui'
import {store} from '../modules'

const {min} = Math
const {factory} = dragonBones.PixiFactory
const hitArea = new PIXI.Circle(0, 0, 40)

export default {
  init() {
    const container = new PIXI.Container()
    const layout = new PIXI.Graphics
    const w = 100

    layout
      .beginFill(0xffcc33, 0)
      .drawRect(0, 0, w * 5, w * 5)
      .endFill()

    layout.interactive = true
    layout.pivot.set(layout.width / 2, layout.height / 2)
    layout.position.set(screen.width / 2, screen.height / 2)
    layout.scale.set(min(zoom.min, 1))

    this.layout = layout
    this.container = container

    const style = {
      fontSize: 42,
      fontFamily: GameGlobal.font,
      fill: [0x529bd1, 0xe0486d, 0xe8a77a][this.level],
    }

    const id = `dot.${['blue', 'pink', 'yellow'][this.level]}.png`

    for (let i = 0; i < 25; i++) {
      let item
      const level = this.level * 25 + i
      const x = i % 5
      const y = i / 5 | 0
      if (level <= store.user.level) {
        item = new PIXI.Text(level + 1, style)
        item.level = level
        item.hitArea = hitArea
        item.interactive = true
        item.anchor.set(.5)
      } else item = PIXI.Sprite.from(id)

      item.position.set(x * w + 50, y * w + 50)
      layout.addChild(item)
    }

    if (!store.user.level) {
      const anime = factory.buildArmatureDisplay('Armature')
      anime.animation.play('tap')
      layout.children[0].addChild(anime)
      layout.once('tap', ev => {
        const {target} = ev
        target?.level === 0 && anime.destroy({children: true})
      })
    }

    container.addChild(layout)
    stage.addChild(container)

    this.listen()
  },

  render() {
    const {layout} = this
    const fill = [0x529bd1, 0xe0486d, 0xe8a77a][this.level]
    const id = `dot.${['blue', 'pink', 'yellow'][this.level]}.png`
    const style = {
      fill,
      fontSize: 42,
      fontFamily: GameGlobal.font
    }

    for (let i = 0; i < 25; i++) {
      const child = layout.children[i]
      const level = this.level * 25 + i
      if (level <= store.user.level) {
        if (child.style) {
          child.level = level
          child.text = level + 1
          child.style.fill = fill
        } else {
          const item = new PIXI.Text(level + 1, style)
          item.level = level
          item.interactive = true
          item.hitArea = hitArea
          item.anchor.set(.5)
          item.position.copyFrom(child.position)
          child.destroy({children: true})
          layout.addChildAt(item, i)
        }
      } else {
        const item = PIXI.Sprite.from(id)
        item.position.copyFrom(child.position)
        child.destroy({children: true})
        layout.addChildAt(item, i)
      }
    }
  },

  listen() {
    const {layout} = this
    layout.on('tap', ev => {
      const {target} = ev
      if (!target || target.level == null) return
      monitor.emit('scene:go', 'game', target.level)
    })
  },

  show(level) {
    this.level = level
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