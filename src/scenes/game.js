import levels from '../levels'
import {store, sound, ad, wx as wechat} from '../modules'
import {stage, screen, design, device, monitor, zoom, ticker} from '../core'
import {tween, easing, chain, everyFrame} from 'popmotion'
import {delay} from '../utils'

const
  {cloud} = wechat,
  {min, max, cos, sin, sqrt, abs, round} = Math,
  pool = []

export default {
  speed: 0,
  index: 0,
  baffles: null,
  point: null,
  last: null,
  first: null,

  init() {
    this.first = true
    this.stamp = performance.now()

    this.container = new PIXI.Container()

    /* 返回按钮 */
    this.back = PIXI.Sprite.from('icon.back.png')
    this.back.tint = 0x8799a3
    this.back.interactive = true
    this.back.anchor.set(0, .5)

    this.diamond = PIXI.Sprite.from('icon.diamond.png')
    this.diamond.interactive = true
    this.diamond.zIndex = 3
    this.diamond.visible = true
    this.diamond.anchor.set(.5)

    /* 💎数量 */
    wechat.cloud.get({diamond: true}).then(({data: {diamond}}) => {
      store.diamond = diamond || 0
      const text = new PIXI.Text(store.diamond, {
        fill: 0xffffff,
        fontSize: 30,
        trim: true
      })
      text.y -= 4
      text.anchor.set(.5)
      this.diamond.addChild(text)
    })

    /* 重试 */
    this.retry = PIXI.Sprite.from('icon.retry.png')
    this.retry.visible = false
    this.retry.tint = 0x00cbfa
    this.retry.interactive = true
    this.retry.anchor.set(0, .5)

    /* 💡 */
    this.bulb = PIXI.Sprite.from('icon.bulb.png')
    this.bulb.visible = true
    this.bulb.tint = 0x00cbfa
    this.bulb.interactive = true
    this.bulb.anchor.set(0, .5)


    store.interaction.then(rect => {
      const {back, retry, bulb, diamond} = this

      back.y =
      retry.y =
      diamond.y = (rect.top + rect.bottom) * .5 * device.pixelRatio
      bulb.y = back.y + 150 * zoom.min

      bulb.x =
      back.x =
      retry.x = (device.width - rect.right) * device.pixelRatio

      diamond.x = screen.width >> 1
    })

    /* info */
    this.info = new PIXI.Text(' ', {
      fill: 0x8799a3,
      fontSize: 32
    })
    this.info.anchor.set(.5, 1)
    this.info.position.set(screen.width >> 1, screen.height - 20)

    {
      const
        {bulb} = this,
        action = tween({
          from: {r: 0, g: 203, b: 250},
          to: {r: 237, g: 70, b: 48},
          ease: easing.linear,
          duration: 3e3,
          yoyo: Infinity
        }).start(v => {
          bulb._destroyed ? action.stop() :
          bulb.tint = (v.r << 16) + (v.g << 8) + v.b
        })
    }

    this.render()
    this.container.addChild(
      this.back, this.retry,
      this.bulb, this.info,
      this.diamond
    )
  },

  /* 关卡渲染 */
  render() {
    const
      width = 1440,
      height = 2560,
      {unlocked} = store,
      m = this.index / 25 | 0,
      n = this.index % 25,
      data = levels[m][n],
      container = new PIXI.Container(),
      interactive = ['blue.png', 'green.png', 'pink.png'],
      single = [
        'yellow.auto.png', 'ring.png', 'arrow.down.png',
        'arrow.up.png', 'arrow.left.png', 'arrow.right.png'
      ],
      hitArea = new PIXI.Circle(0, 0, 52),
      ball = PIXI.Sprite.from('ball.png')

    let removed = false

    ball.visible = false
    ball.anchor.set(.5)

    this.baffles = data.baffles.map(item => {
      let baffle

      if (single.indexOf(item.frame) > -1) {
        baffle = PIXI.Sprite.from(item.frame)
      } else {
        baffle = PIXI.AnimatedSprite
          .fromFrames(Array.from(
            {length: 31},
            (_, i) => item.frame.replace('.png', `.${i + 1}.png`)
          ))

        baffle.loop = false
        baffle.animationSpeed = .6
        baffle.scale.set(2)
      }

      /* ring */
      if (item.frame === 'ring.png') {
        const action = everyFrame().start(() => {
          if (baffle._destroyed) return action.stop()
          baffle.rotation += .02
          baffle.rotation %= PI2
        })
      }

      /* shadow */
      if (item.shadow) {
        const shadow = PIXI.Sprite.from(item.frame)
        shadow.alpha = .5
        shadow.visible = false
        shadow.angle = item.shadow
        baffle.shadow = shadow
        shadow.anchor.set(.5)
        shadow.position.set(item.x, item.y)
        container.addChild(shadow)
      }

      baffle.name = item.frame
      baffle.type = 'baffle'
      baffle.collidable = true
      baffle.interactive =
      baffle.clickable = interactive.indexOf(item.frame) > -1
      baffle.angle = item.angle || 0

      baffle.interactive ? baffle.hitArea = hitArea : 0
      baffle.prop = item

      baffle.anchor.set(.5)
      baffle.position.set(item.x, item.y)
      container.addChild(baffle)
      return baffle
    })

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

    {
      const arrow = PIXI.Sprite.from('start.core.png')
      arrow.anchor.set(.5)
      start.addChild(arrow)
    }

    start.zIndex = 1
    start.interactive = true
    start.animationSpeed = .1

    start.play()
    start.anchor.set(.5)
    start.position.set(data.start.x, data.start.y)
    start.on('tap', this.start.bind(this))

    const end = PIXI.Sprite.from('end.png')
    end.anchor.set(.5)
    end.position.set(data.end.x, data.end.y)

    container
      .on('added', () => {
        screen.align(container)
      })
      .on('pointerdown', ev => {
        const {target} = ev
        /* 挡板 */
        if (target.type === 'baffle') {
          target.interactive = false
          const action = tween({
            from: target.angle,
            to: target.angle + 90,
            ease: easing.linear,
            duration: 2e2
          }).start({
            update: v => {
              target._destroyed ? action.stop() : target.angle = v
            },

            complete: () => {
              target.angle %= 360
              target.interactive = true
            }
          })
        }
      })

    this.ball = ball
    this.point = {start, end}
    container.name = 'stage'
    container.interactive = true
    container.scale.set(min(
      1,
      min(screen.width, design.width) / width,
      min(screen.height, design.height) / height
    ))
    container.addChild(start, end, ball)
    this.container.addChild(container)
  },

  cue() {
    const
      {point: {start}, baffles} = this,
      baffle = baffles[0],
      cues = Array.from({length: 2}, () => {
        const cue = PIXI.Sprite.from('circle.cue.png')
        cue.alpha = 0
        cue.anchor.set(.5)

        const action = tween({
          from: 0,
          to: 1,
          yoyo: Infinity,
          duration: 6e2,
          ease: easing.linear
        }).start(v => {
          cue._destroyed ? action.stop() : cue.alpha = v
        })

        return cue
      })

    cues[0].scale.set(baffle.height / cues[0].width)
    cues[0].position.copyFrom(baffle.position)

    cues[1].visible = false
    cues[1].position.copyFrom(start.position)
    cues[1].scale.copyFrom(cues[0].scale)


    baffle.once('pointerdown', () => {
      cues[1].visible = true
      cues[0].destroy()
    })

    start.on('tap', () => {
      cues[1].visible &&
      !cues[1]._destroyed &&
      cues[1].destroy()
    })

    baffle.parent.addChild(...cues)
  },

  start() {
    const {
      ball,
      baffles,
      point: {start}
    } = this

    this.speed = 14
    this.last = null

    ball.visible = true
    ball.angle = 270
    ball.position.copyFrom(start.position)

    this.back.visible = false
    this.retry.visible = true

    /* 不可交互 */
    start.interactive = false
    baffles.forEach(baffle => baffle.interactive = false)

  },

  time() {
    const
      {stamp, info, fill} = this,
      now = performance.now()

    let second = round((now - stamp) / 1e3)

    const minute = second / 60 | 0
    second -= minute * 60

    info.text = `${fill(this.index + 1)}  ${fill(minute)}:${fill(second)}`
  },

  fill(i) {
    return i < 10 ? `0${i}` : i
  },

  update() {
    const
      {ball, speed} = this

    this.time()

    if (!speed) return

    ball.x += cos(ball.rotation) * speed
    ball.y += sin(ball.rotation) * speed

    this.trail()
    this.detect()
  },

  /* 拖尾 */
  trail() {
    const {ball, last} = this

    if (!last) return this.last = ball.position.clone()
    if (this.distance(last, ball) < 30) return

    const dot = pool.pop() || PIXI.Sprite.from('trail.png')

    dot.alpha = 1
    dot.anchor.set(.5)
    dot.position.copyFrom(this.last)
    ball.parent.addChild(dot)

    this.last.copyFrom(ball.position)

    const action = tween({
      from: 1,
      to: 0,
      duration: 5e2,
      ease: easing.linear
    }).start({
      update: v => dot._destroyed ? action.stop() : dot.alpha = v,
      complete: () => {
        dot.parent.removeChild(dot)
        pool.push(dot)
      }
    })
  },

  win() {
    const
      {ball, point: {end}} = this,
      unlocked = min(this.index + 1 === store.unlocked ? this.index + 2 : store.unlocked, 75)

    /* 排行榜 */
    wx.postMessage({
      type: 'upload',
      data: unlocked
    })

    /* 服务器 */
    cloud.update({
      unlocked,
      level: {
        [this.index + 1]: (performance.now() - this.stamp) / 1e3 | 0
      }
    }).catch(err => {})

    /* 本地 */
    store.unlocked = unlocked

    this.index < 74 ? this.index++ : wx.showToast({title: '恭喜通关', icon: 'none', duration: 2e3})
    this.speed = 0

    ball.position.copyFrom(end.position)

    this.retry.visible = false
    this.back.visible = true

    store.setting.voice && sound.play('static/sounds/win.mp3')

    const action = chain(
      tween({from: 1, to: 3}),
      tween({from: 3, to: 0})
    ).start({
      update: v => {
        ball._destroyed ? action.stop() : ball.scale.set(v)
      },

      complete: () => {
        this.next()
      }
    })
  },

  next() {
    this.stamp = performance.now()
    this.first = true

    /* 清除场景 */
    {
      const stage = this.container.getChildByName('stage')
      stage.destroy({children: true})
    }

    this.render()
  },

  fail() {
    store.setting.voice && sound.play('static/sounds/fail.mp3')

    wx.showToast({
      title: this.first ? '点击灯泡或钻石获取提示' : '再来一次',
      icon: 'none',
      duration: this.first ? 2e3 : 1.5e3
    })

    this.first = false

    this.restore()
  },

  restore(clean = false) {
    const {ball, back, retry, baffles, point: {start}} = this

    this.speed = 0
    this.stamp = performance.now()

    ball.visible = false
    retry.visible = false
    back.visible = true
    start.interactive = true

    baffles.forEach(baffle => {
      baffle.visible = true
      baffle.collidable = true
      baffle.interactive = baffle.clickable
      baffle instanceof PIXI.AnimatedSprite && baffle.gotoAndStop(0)

      if (!clean && baffle.clickable) return

      const {x, y, angle} = baffle.prop
      baffle.angle = angle || 0
      baffle.position.set(x, y)
    })
  },

  /* 碰撞检测 */
  detect() {
    const {ball, baffles, speed, point: {end}} = this

    /* end */
    if (this.distance(ball, end) <= speed) return this.win()

    /* 出界 */
    {
      const {x, y} = ball.getGlobalPosition()
      if (!screen.contains(x, y)) return this.fail()
    }

    for (const baffle of baffles) {
      if (!baffle.collidable) continue
      const d = this.distance(ball, baffle)
      if (d <= speed && !baffle.hold) {
        baffle.hold = true
        this.respond(ball, baffle)
      } else if (d > speed && baffle.hold) {
        baffle.hold = false
      }
    }
  },

  /* 响应 */
  respond(ball, baffle) {
    baffle instanceof PIXI.AnimatedSprite && baffle.gotoAndPlay(0)
    ball.position.copyFrom(baffle.position)


    if (baffle.name === 'yellow.auto.png' ||
      baffle.name === 'pink.png' ||
      baffle.name === 'blue.png') {
      const
        p = this.normal(baffle.angle) % 180,
        q = this.normal(ball.angle)

      if (p === 45) {
        q / 90 % 2 ? ball.angle += 90 : ball.angle -= 90
      } else {
        q / 90 % 2 ? ball.angle -= 90 : ball.angle += 90
      }
    } else if (baffle.name === 'green.png') {
      const
        p = this.normal(baffle.angle),
        q = this.normal(ball.angle)

      let delta = p - q

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
      const
        p = this.normal(baffle.angle),
        q = this.normal(ball.angle)

      let delta = p - q

      if (delta === 0 || delta === -90 || delta === 270) ball.angle += 180
      else if (delta === 90 || delta === -270) ball.angle += 90
      else ball.angle -= 90
    }

    switch (baffle.name) {
      case 'yellow.auto.png': {
        const action = tween({
          from: baffle.angle,
          to: baffle.angle + 90
        }).start(v => {
          baffle._destroyed ? action.stop() : baffle.angle = v
        })
        store.setting.voice && sound.play('static/sounds/collide.gear.mp3')
        break
      }

      case 'arrow.up.png':
      case 'arrow.down.png':
      case 'arrow.left.png':
      case 'arrow.right.png': {
        const
          tx = baffle.name === 'arrow.left.png' ? -200 :
            baffle.name === 'arrow.right.png' ? 200 : 0,
          ty = baffle.name === 'arrow.up.png' ? -200 :
            baffle.name === 'arrow.down.png' ? 200 : 0

        const action = tween({
          from: {x: baffle.x, y: baffle.y},
          to: {x: baffle.x + tx, y: baffle.y + ty},
          duration: 3e2,
          ease: easing.linear
        }).start(v => baffle._destroyed ? action.stop() : baffle.position.copyFrom(v))
        store.setting.voice && sound.play('static/sounds/collide.arrow.mp3')
        break
      }

      case 'square.once.png':
      case 'pink.png': {
        baffle.collidable = false
        baffle.onComplete = () => {
          baffle.visible = false
          baffle.shadow ? baffle.shadow.visible = false : 0
        }
        store.setting.voice && sound.play('static/sounds/collide.once.mp3')
        break
      }

      case 'ring.png': {
        store.setting.voice && sound.play('static/sounds/transfer.mp3')
        break
      }

      case 'green.png': {
        store.setting.voice && sound.play('static/sounds/collide.green.mp3')
        break
      }

      default: {
        store.setting.voice && sound.play('static/sounds/collide.mp3')
        break
      }
    }

  },

  /* 0 - 360 */
  normal(angle) {
    angle = round(angle) % 360
    return angle < 0 ? angle + 360 : angle
  },

  distance(p, q) {
    return sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2)
  },

  /* 提示 */
  hint() {
    const {baffles} = this
    for (const baffle of baffles) {
      if (!baffle.shadow) continue

      // baffle.shadow.visible = true
      // baffle.angle = baffle.shadow.angle + 90

      /* 直接纠正 */
      baffle.interactive = false
      const action = tween({
        from: baffle.angle,
        to: baffle.shadow.angle,
        duration: 3e2,
        ease: easing.easeInOut
      }).start({
        update: v => baffle._destroyed ? action.stop() : baffle.angle = v,
        complete: () => baffle.interactive = true
      })
    }
  },

  listen() {
    const {retry, bulb, back, diamond} = this

    diamond.on('tap', () => {
      if (store.diamond < 1) return wx.showModal({
        title: '邀请好友 获取钻石',
        content: '好友通过卡片进入游戏后获得钻石',
        cancelColor: '#999999',
        confirmText: '分享',
        confirmColor: '#00b26a',
        success: ({confirm}) => {
          confirm && monitor.emit('wx:share')
        }
      })
      this.restore(true)
      this.hint()
      store.diamond--
      diamond.children[0].text = store.diamond
      wechat.cloud.update({diamond: store.diamond})
    })

    retry.on('tap', () => {
      this.restore()
      wx.showToast({title: '重置完成', icon: 'none'})
    })

    bulb.on('tap', () => {
      bulb.interactive = false
      ad.show()
        .then(ok => {
          monitor.emit('ad:close')

          if (!ok) return

          this.restore(true)
          this.hint()
        })
        .catch(err => {
          wx.showToast({title: err.errMsg, icon: 'none'})
        })
        .then(() => {
          bulb.interactive = true
        })
    })

    back.on('tap', () => {
      this.hide()
      monitor.emit('scene:go', 'entry')
    })
  },

  show(i) {
    this.index = i
    this.init()
    this.listen()
    stage.addChild(this.container)
    ticker.add(this.update, this)
    /* 首次进入 */
    store.unlocked === 1 && this.cue()
  },

  hide() {
    this.speed = 0

    this.ball =
    this.info =
    this.bulb =
    this.back =
    this.retry =
    this.point =
    this.first =
    this.baffles = null

    this.container.destroy({children: true})
    ticker.remove(this.update, this)
  }
}