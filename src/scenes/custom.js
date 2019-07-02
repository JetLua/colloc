import {stage, screen, device, monitor} from '../core'
import {renderer, store, wx as wechat} from '../modules'



export default {
  last: 0,
  mode: 'design',

  init() {
    this.container = new PIXI.Container()

    this.uploadBtn = PIXI.Sprite.from('icon.upload.png')
    this.uploadBtn.interactive = true
    this.uploadBtn.visible = this.mode === 'design'
    this.uploadBtn.scale.set(.6)

    /* 返回按钮 */
    this.back = PIXI.Sprite.from('icon.back.png')
    this.back.tint = 0x8799a3
    this.back.visible = false
    this.back.interactive = true
    this.back.anchor.set(0, .5)

    /* 重试 */
    this.retry = PIXI.Sprite.from('icon.retry.png')
    this.retry.visible = false
    this.retry.tint = 0x00cbfa
    this.retry.interactive = true
    this.retry.anchor.set(0, .5)

    store.interaction.then(rect => {
      const {back, retry} = this

      back.visible = !retry.visible
      back.y =
      retry.y = (rect.top + rect.bottom) * .5 * device.pixelRatio

      back.x =
      retry.x = (device.width - rect.right) * device.pixelRatio
    })

    this.container.addChild(
      renderer.stage,
      renderer.bar.left,
      renderer.bar.right,
      this.uploadBtn,
      this.back,
      this.retry
    )
  },

  async upload() {
    const now = Date.now()
    if (now - this.last < 3e4) return wx.showToast({title: '操作过于频繁', icon: 'none'})

    let stuff = renderer.extract()
    if (!stuff) return

    this.uploadBtn.visible = false
    wx.showLoading({title: '上传关卡数据'})

    stuff = await wechat.cloud.upload(stuff).catch(() => false)
    if (!stuff) return wx.showToast({title: '上传失败', icon: 'none'})

    this.last = now

    const {result: {fileID, id}} = stuff

    wx.showModal({
      title: '上传成功',
      content: '分享给好友或者保存二维码',
      confirmText: '分享',
      cancelText: '保存',
      success: info => {
        if (info.confirm) {
          monitor.emit('wx:share', {
            title: '快来试试我设计的关卡...',
            query: `scene=${id}`,
            imageUrl: 'https://static.lufei.so/colloc/snapshot/1.png'
          })
        } else {
          wx.previewImage({
            urls: [fileID]
          })
        }
      }
    })

    this.uploadBtn.visible = true
    wx.hideLoading()
  },

  listen() {
    this.container.once('added', () => {
      screen.align(renderer.stage)
      screen.align(renderer.bar.left, {left: 0})
      screen.align(renderer.bar.right, {right: 0})
      screen.align(this.uploadBtn, {bottom: 20})
    })

    this.uploadBtn.on('tap', this.upload.bind(this))

    this.retry.on('tap', () => {
      this.retry.visible = false
      this.back.visible = true
      renderer.restore()
    })

    this.back.on('tap', () => {
      this.hide()
      monitor.emit('scene:go', 'entry')
    })

    renderer.stage
      .on('started', () => {
        this.back.visible = false
        this.retry.visible = true
      })
      .on('ended', win => {
        this.back.visible = true
        this.retry.visible = false

        if (this.mode === 'normal' && win) {
          wx.showModal({
            title: '完美过关',
            content: '开启新的征程',
            confirmText: '确定',
            cancelText: '重玩',
            success: ({confirm}) => {
              if (confirm) {
                this.hide()
                monitor.emit('scene:go', 'entry')
              }
            }
          })
        }
      })
  },

  async load(id) {
    wx.showLoading({title: '载入关卡数据'})

    const stuff = await wechat.cloud.load(id).catch(() => false)

    wx.hideLoading()

    if (!stuff) {
      wx.showToast({title: '载入失败', icon: 'none'})
      this.hide()
      monitor.emit('scene:go', 'entry')
      return
    }

    const
      {data: {author, conf}} = stuff,
      info = new PIXI.Text('', {
        fill: 0x8799a3,
        fontSize: 32
      })

    renderer.stage.visible = true
    info.text = `By ${author}`
    renderer.render(conf)
    this.container.addChild(info)
    screen.align(renderer.stage)
    screen.align(info, {bottom: 10, left: 10})
  },

  show(id) {
    if (id) {
      this.mode = 'normal'
      renderer.stage.visible = false
      this.load(id)
    }

    renderer.setMode(this.mode)
    this.init()
    this.listen()
    stage.addChild(this.container)

    if (!store.design && this.mode === 'design') {
      store.design = true
      wx.showModal({
        title: '提示',
        content: '拖动白色圆圈里的道具到中央区域测试挡板功能，也可以点击底部上传按钮，分享你的关卡',
        showCancel: false
      })
    }
  },

  hide() {
    const {container} = this
    this.mode = 'design'
    this.container = null
    renderer.clean()
    container.destroy({children: true})
  }
}