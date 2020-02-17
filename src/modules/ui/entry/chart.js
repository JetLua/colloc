import {screen, stage, zoom} from '../../../core'
import {store} from '../../../modules'
import {db, call} from '../../wx'

const padding = 30
const {min, sign, max} = Math
const style = new PIXI.TextStyle({
  fill: 0xffffff,
  fontWeight: 'bold'
})

export default {
  cursor: 0,

  init() {
    const shadow = new PIXI.Graphics()
      .beginFill(0x333333, .5)
      .drawRect(0, 0, screen.width, screen.height)
      .endFill()

    this.shadow = shadow

    shadow.zIndex = 5
    shadow.name = 'shadow'
    shadow.interactive = true

    const container = new PIXI.Graphics()
      .beginFill(0xffcc33, 0)
      .drawRect(0, 0, 600, 1000)
      .endFill()

    container.pivot.set(300, 500)
    container.position.set(screen.width / 2, screen.height / 2)
    container.scale.set(min(zoom.min, 1))
    container.interactive = true
    container.hitArea = new PIXI.Rectangle(0, 0, 600, 1000)

    const list = new PIXI.Graphics()
      .beginFill(0, .5)
      .drawRoundedRect(0, 0, 600, 840)
      .endFill()

    this.list = list

    const own = new PIXI.Graphics()
      .beginFill(0, .5)
      .drawRoundedRect(0, 0, 600, 120)
      .endFill()

    own.x = list.x
    own.y = list.y + list.height + 40
    this.own = own

    container.addChild(list, own)
    shadow.addChild(container)
    stage.addChild(shadow)

    this.render('list')
    this.render('own')
    this.listen()
  },

  async render(type) {
    const style = {
      fill: 0xffffff,
      fontSize: 32,
      fontWeight: 'bold',
      fontFamily: GameGlobal.font
    }

    if (type === 'list') {
      const data = await db.collection('user')
        .orderBy('user.level', 'desc')
        .orderBy('timestamp', 'desc')
        .skip(this.cursor * 10)
        .limit(10)
        .field({user: true})
        .get()
        .then(({data}) => data)
        .catch(() => null)

      if (!data) return wx.showToast({title: '数据拉取失败', icon: 'none'})
      if (!data.length) return


      const {list} = this

      list.removeChildren().forEach(child => child.destroy({children: true}))

      let prev, next

      if (this.cursor) {
        prev = PIXI.Sprite.from('btn.up.png')
        prev.interactive = true
        prev.y = 840
        prev.name = 'prev'
        prev.scale.set(.5)
        list.addChild(prev)
      }

      if (data.length === 10) {
        next = PIXI.Sprite.from('btn.down.png')
        next.interactive = true
        next.y = 840
        next.name = 'next'
        next.scale.set(.5)
        list.addChild(next)
      }

      prev && (prev.x = next ? 260 : 300)
      next && (next.x = prev ? 340 : 300)

      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        const name = this.text(item.user.name || item._id)
        const avatar = PIXI.Sprite.from(item.user.avatar || 'avatar.png')
        const level = new PIXI.Text(item.user.level || 0, style)

        avatar.width =
        avatar.height = 60
        avatar.anchor.set(.5)

        avatar.y = i * 80 + 60
        avatar.x += avatar.width / 2 + padding

        name.y = avatar.y
        name.x = avatar.x + avatar.width / 2 + 10 * 3
        name.anchor.set(0, .5)

        level.x = 600 - padding
        level.y = avatar.y
        level.anchor.set(1, .5)

        list.addChild(avatar, name, level)
      }
    } else {
      const data = await call({name: 'alexa'})
        .catch(() => null)

      if (!data) return wx.showToast({title: '个人排名拉取失败', icon: 'none'})


      const {own} = this
      // clean
      own.removeChildren().forEach(child => child.destroy({children: false}))

      let {id, alexa} = data
      const name = this.text(store.user.name || id)
      const avatar = PIXI.Sprite.from(store.user.avatar || 'avatar.png')
      const level = new PIXI.Text(store.user.level || 0, style)

      alexa += 1
      alexa > 1000 && (alexa = '1000+')

      alexa = new PIXI.Text(alexa, {
        fill: 0xff502e,
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: GameGlobal.font
      })

      alexa.anchor.set(0, .5)
      alexa.position.set(padding, 60)

      avatar.width =
      avatar.height = 60
      avatar.anchor.set(.5)
      avatar.position.set(alexa.x + alexa.width + 30 + padding, 60)

      name.position.set(avatar.x + avatar.width / 2 + 10 * 3, avatar.y)
      name.anchor.set(0, .5)

      level.anchor.set(1, .5)
      level.position.set(own.width - padding, avatar.y)

      own.addChild(alexa, name, avatar, level)
    }
  },

  text(name) {
    let trimmed = false
    while (true) {
      const {width} = PIXI.TextMetrics.measureText(name, style)
      if (width < 280) break
      trimmed = true
      name = name.slice(0, -1)
    }

    trimmed && (name += '...')

    return new PIXI.Text(name, style)
  },

  listen() {
    const {shadow} = this
    shadow.on('tap', ev => {
      switch (ev.target?.name) {
        case 'prev': {
          this.cursor--
          this.render('list')
          break
        }

        case 'next': {
          this.cursor++
          this.render('list')
          break
        }

        case 'shadow': {
          this.hide()
          break
        }
      }
    })
  },

  show() {
    if (this.shadow) {
      this.shadow.visible = true
      this.render('list')
      this.render('own')
      return
    }

    this.init()
  },

  hide() {
    this.shadow.visible = false
  }
}