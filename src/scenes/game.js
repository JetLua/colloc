import {stage, screen, ticker, monitor} from '../core'
import {backBtn} from '../modules/ui'
import {menu} from '../modules/ui/game'
import {store, sound} from '../modules'
import {ad, call} from '../modules/wx'
import levels from '../levels'
import {tween, everyFrame, easing, chain} from 'popmotion'

const {factory} = dragonBones.PixiFactory
const {min, PI, cos, sin, sqrt, abs, round, max, random} = Math
const PI2 = PI * 2
const hitArea = new PIXI.Circle(0, 0, 52)
const single = /^gear|ring|arrow/
const clickable = /^blue|green|pink/
const width = 1440
const height = 2560
const pool = []

export default {
  speed: 0,
  interval: 0,

  init() {
    const container = new PIXI.Container()
    this.container = container
    this.render()
    stage.addChild(container)
    this.listen()
    ticker.add(this.update.bind(this))
  },

  render() {
    const {level, container} = this
    const data = levels[level / 25 | 0][level % 25]
    const layout = new PIXI.Container()

    this.layout = layout
    container.interactive = true

    const start = PIXI.AnimatedSprite.fromFrames([
      'start.1.png',
      'start.2.png',
      'start.3.png',
      'start.4.png',
      'start.5.png',
      'start.4.png',
      'start.3.png',
      'start.2.png'
    ])

    start.type = 'start'
    start.animationSpeed = .1
    start.interactive = true
    start.play()
    start.position.copyFrom(data.start)
    start.addChild(PIXI.Sprite.from('start.core.png'))

    const end = PIXI.Sprite.from('end.png')
    this.end = end
    end.position.copyFrom(data.end)

    this.baffles = data.baffles.map(item => {
      const a = single.test(item.frame)
      const baffle = a ? PIXI.Sprite.from(item.frame) :
        PIXI.AnimatedSprite.fromFrames(Array.from({length: 31}, (_, i) => {
          return item.frame.replace('.png', `.${i + 1}.png`)
        }))

      if (!a) {
        baffle.loop = false
        baffle.animationSpeed = .6
        baffle.scale.set(2)
      }

      if (item.frame === 'ring.png') {
        const anime = everyFrame().start(() => {
          if (baffle._destroyed) return anime.stop()
          baffle.rotation += .02
          baffle.rotation %= PI2
        })
      }

      baffle.type = 'baffle'
      baffle.name = item.frame
      baffle.shadow = item.shadow
      baffle.angle = item.angle || 0
      baffle.collidable = true
      baffle.interactive = clickable.test(item.frame)
      baffle.position.copyFrom(item)
      layout.addChild(baffle)

      baffle.interactive && (baffle.hitArea = hitArea)
      return baffle
    })

    const ball = PIXI.Sprite.from('ball.png')
    this.ball = ball
    ball.visible = false
    ball.position.copyFrom(start)

    layout.addChild(start, end, ball)
    {
      const {x, y, width, height} = layout.getLocalBounds()
      layout.pivot.set(width / 2 + x, height / 2 + y)
    }
    layout.position.set(screen.width / 2, screen.height / 2)
    layout.scale.set(min(
      screen.width / width,
      screen.height / height,
      1
    ))

    container.addChild(layout)

    // 新手提示
    if (!store.user.level) {
      const anime = factory.buildArmatureDisplay('Armature')
      anime.animation.play('tap')
      anime.scale.set(1 / layout.scale.x)
      anime.position.copyFrom(this.baffles[0])
      layout.addChild(anime)
      this.baffles[0].once('tap', () => {
        anime.position.copyFrom(start)
      })
      start.once('tap', () => {
        anime.destroy({children: true})
      })
    }
  },

  tick() {
    this.interval += ticker.elapsedMS
    if (this.interval < 16) return
    this.interval %= 16
    const {ball, speed} = this
    ball.x += cos(ball.rotation) * speed
    ball.y += sin(ball.rotation) * speed
  },

  update() {
    if (!this.speed) return
    this.tick()
    this.trail()
    this.detect()
  },

  win() {
    const {ball, end} = this
    this.speed = 0
    ball.position.copyFrom(end)

    sound.play({name: 'win.mp3'})

    ad.show('adunit-e0ecc6cf322cb27a', 'splash').catch(console.log)


    this.level++

    if (store.user.level < this.level) {
      store.user.level = min(this.level, 75)
      call({
        name: 'setScore',
        data: {level: store.user.level}
      })
    }

    if (this.level > 74) {
      this.level = 74
      wx.showModal({
        title: '恭喜通关',
        content: '分享给好友，一起来玩吧！',
        cancelText: '返回',
        confirmColor: '#07c160',
        success: ({confirm, cancel}) => {
          // todo
          if (confirm) {
            wx.shareAppMessage({
              title: '哈哈哈，我已通关了！你来试试看...',
              imageUrl: 'https://static.lufei.so/colloc/images/' + [
                'share.1.png',
                'share.2.png',
                'share.3.png',
                'share.4.png',
                'share.5.png',
              ][random() * 5 | 0]
            })
          }
          monitor.emit('scene:back')
        }
      })
    }

    const anime = chain(
      tween({from: 1, to: 3}),
      tween({from: 3, to: 0})
    ).start({
      update: v => ball._destroyed ? anime.stop() : ball.scale.set(v),
      complete: () => {
        this.layout.destroy({children: true})
        this.render()
      }
    })


  },

  fail() {
    this.speed = 0
    sound.play({name: 'fail.mp3'})
    this.layout.destroy({children: true})
    this.render()
    wx.showToast({
      icon: 'none',
      duration: 2e3,
      title: [
        '再来一次',
        '别灰心',
        '重新来过'
      ][random() * 3 | 0]
    })
  },

  detect() {
    const {ball, baffles, speed, end} = this

    // win
    if (this.distance(ball, end) < speed) return this.win()

    // outside
    {
      const {x, y} = ball.getGlobalPosition()
      if (!screen.contains(x, y)) return this.fail()
    }

    for (const baffle of baffles) {
      if (!baffle.collidable) continue
      const d = this.distance(ball, baffle)
      if (d <= speed && !baffle.hold) {
        baffle.hold = true
        this.handle(ball, baffle)
      } else if (d > 52 && baffle.hold) {
        baffle.hold = false
      }
    }
  },

  handle(ball, baffle) {
    baffle instanceof PIXI.AnimatedSprite && baffle.gotoAndPlay(0)
    ball.position.copyFrom(baffle.position)

    if (baffle.name === 'gear.png' ||
      baffle.name === 'pink.png' ||
      baffle.name === 'blue.png') {
      const p = this.normalize(baffle.angle) % 180
      const q = this.normalize(ball.angle)

      if (p === 45) {
        q / 90 % 2 ? ball.angle += 90 : ball.angle -= 90
      } else {
        q / 90 % 2 ? ball.angle -= 90 : ball.angle += 90
      }
    } else if (baffle.name === 'green.png') {
      let delta = this.normalize(baffle.angle) - this.normalize(ball.angle)

      if (abs(delta) !== 45 && delta !== 315) {
        delta < 0 ? delta += 360 : 0
        delta %= 180
        delta === 135 ? ball.angle += 90 :
        delta === 45 ? ball.angle -= 90 : 0
      }

    } else if (baffle.name === 'ring.png') {
      const next = this.baffles.find(item => item.name === 'ring.png' && item !== baffle)
      next.hold = true
      ball.position.copyFrom(next.position)

    } else if (baffle.name === 'square.png' || baffle.name === 'square.once.png' ||
      baffle.name === 'arrow.up.png' || baffle.name === 'arrow.left.png' ||
      baffle.name === 'arrow.down.png' || baffle.name === 'arrow.right.png') {
      ball.angle += 180
    } else if (baffle.name === 'triangle.png') {
      const delta = this.normalize(baffle.angle) - this.normalize(ball.angle)

      if (delta === 0 || delta === -90 || delta === 270) ball.angle += 180
      else if (delta === 90 || delta === -270) ball.angle += 90
      else ball.angle -= 90
    }

    switch (baffle.name) {
      case 'gear.png': {
        const anime = tween({
          from: baffle.angle,
          to: baffle.angle + 90
        }).start(v => baffle._destroyed ? anime.stop() : baffle.angle = v)
        sound.play({name: 'collide.gear.mp3'})
        break
      }

      case 'arrow.up.png':
      case 'arrow.down.png':
      case 'arrow.left.png':
      case 'arrow.right.png': {
        const tx = baffle.name === 'arrow.left.png' ? -200 : baffle.name === 'arrow.right.png' ? 200 : 0
        const ty = baffle.name === 'arrow.up.png' ? -200 : baffle.name === 'arrow.down.png' ? 200 : 0

        const anime = tween({
          from: {x: baffle.x, y: baffle.y},
          to: {x: baffle.x + tx, y: baffle.y + ty},
          duration: 3e2,
          ease: easing.linear
        }).start(v => baffle._destroyed ? anime.stop() : baffle.position.copyFrom(v))

        sound.play({name: 'collide.arrow.mp3'})
        break
      }

      case 'square.once.png':
      case 'pink.png': {
        baffle.collidable = false
        baffle.onComplete = () => {
          baffle.visible = false
        }
        sound.play({name: 'collide.once.mp3'})
        break
      }

      case 'ring.png': {
        sound.play({name: 'transfer.mp3'})
        break
      }

      case 'green.png': {
        sound.play({name: 'collide.green.mp3'})
        break
      }

      default: {
        sound.play({name: 'collide.mp3'})
        break
      }
    }
  },

  trail() {
    const {ball, last} = this

    if (!last) return this.last = ball.position.clone()
    if (this.distance(last, ball) < 34) return

    const dot = pool.pop() || PIXI.Sprite.from('trail.png')

    dot.alpha = 1
    dot.anchor.set(.5)
    dot.position.copyFrom(this.last)
    ball.parent.addChild(dot)

    this.last.copyFrom(ball.position)

    const anime = tween({
      from: 1,
      to: 0,
      duration: 5e2,
      ease: easing.linear
    }).start({
      update: v => dot._destroyed ? anime.stop() : dot.alpha = v,
      complete: () => {
        dot.parent.removeChild(dot)
        pool.push(dot)
      }
    })
  },

  /* 0 - 360 */
  normalize(angle) {
    angle = round(angle) % 360
    return angle < 0 ? angle + 360 : angle
  },

  distance(p, q) {
    return sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2)
  },

  hint() {
    this.layout.destroy({children: true})
    this.render()

    const {baffles} = this
    for (const baffle of baffles) {
      if (!baffle.shadow) continue

      const anime = tween({
        from: baffle.angle,
        to: baffle.shadow,
        duration: 3e2,
        ease: easing.easeInOut
      }).start({
        update: v => baffle._destroyed ? anime.stop() : baffle.angle = v,
        complete: () => baffle.interactive = true
      })
    }
  },

  listen() {
    const {container} = this
    container.on('tap', ev => {
      const {target} = ev
      if (target.type === 'baffle') {
        target.interactive = false
        const anime = tween({
          from: target.angle,
          to: target.angle + 90,
          duration: 2e2
        }).start({
          update: v => {
            target._destroyed ? anime.stop() : target.angle = v
          },

          complete: () => {
            target.angle %= 360
            target.interactive = true
          }
        })
      } else if (target.type === 'start') {
        const {ball, baffles} = this
        container.interactive = false
        this.speed = 18
        this.last = null
        ball.angle = -90
        ball.visible = true
      }
    })
    menu.on('hint', () => {
      wx.showModal({
        title: '过关提示',
        content: '观看视频广告获取过关提示',
        confirmColor: '#07c160',
        success: ({confirm, cancel}) => {
          if (!confirm) return
          ad.show('adunit-035f929608f8c858', 'video').then(ended => {
            if (!ended) return wx.showToast({title: '看完视频才有提示哦！', icon: 'none'})
            this.hint()
          }).catch(() => {
            wx.showToast({title: '广告展示失败', icon: 'none'})
          })
        }
      })
    }).on('replay', () => {
      sound.play({name: 'reset.mp3'})
      this.speed = 0
      this.layout.destroy({children: true})
      this.render()
    }).on('chart', () => {
      wx.showToast({
        title: '暂未开放',
        icon: 'none'
      })
    })
  },

  show(level) {
    this.level = level

    menu.show()
    backBtn.show()

    if (this.container) {
      this.container.visible = true
      this.layout.destroy({children: true})
      return this.render()
    }

    this.init()

    GameGlobal.hint = this.hint.bind(this)
  },

  hide() {
    backBtn.hide()
    menu.hide()
    this.container.visible = false
  }
}