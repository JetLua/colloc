import {stage, monitor} from './core'
import {store, sound} from './modules'
import {login, call, ad} from './modules/wx'
import {preload, entry, setting, selector, game} from './scenes'

{
  let resolve
  GameGlobal.show = new Promise(_ => resolve = _)
  wx.onShow(() => {
    resolve()
    monitor.emit('wx:show')
  })

  wx.onAudioInterruptionEnd(() => {
    monitor.emit('wx:interruption:end')
  })
}

Promise.all([
  preload(),
  GameGlobal.show,
]).then(() => {
  ad.show('adunit-e0ecc6cf322cb27a', 'splash').catch(console.log)
  monitor.emit('scene:go', 'entry')
}).then(() => {
  login().catch(() => null).then(async info => {
    const {user, setting} = store

    if (info) {
      user.city = info.city
      user.name = info.nickName
      user.gender = info.gender
      user.country = info.country
      user.avatar = info.avatarUrl
      user.province = info.province
    }

    info = await call({
      name: 'sync',
      data: {
        user,
        setting,
        timestamp: store.timestamp
      }
    }).catch(() => null)

    if (!info) return
    store.id = info.id
    store.user = info.data.user
    store.setting = info.data.setting
  })
})

/* 路由 */
{
  const stack = []

  monitor.on('scene:back', () => {
    if (stack.length < 2) return
    stack.pop().cursor.hide()
    const {cursor, args} = stack[stack.length - 1]
    cursor.show(...args)
  }).on('scene:go', (name, ...args) => {
    let cursor = {
      game,
      entry,
      setting,
      selector
    }[name]

    stack[stack.length - 1]?.cursor.hide()
    cursor.show(...args)
    stack.push({cursor, args})
  })
}

{
  const opt = {name: 'bgm.mp3', loop: true, autoplay: store.setting.music, volume: .4}
  sound.bgm.play(opt)
  monitor.on('wx:interruption:end', () => {
    sound.bgm.paused &&
    store.setting.music &&
    sound.bgm.resume()
  }).on('wx:show', () => {
    sound.bgm.paused &&
    store.setting.music &&
    sound.bgm.resume()
  })
}

/* 等待交互 */
{
  let resolve
  GameGlobal.interaction = new Promise(_ => resolve = _)
  wx.onTouchStart(handle)
  function handle() {
    wx.offTouchStart(handle)
    resolve(wx.getMenuButtonBoundingClientRect())
  }
}

/* 检查更新 */
{
  const manager = wx.getUpdateManager()
  manager.onUpdateReady(() => {
    manager.applyUpdate()
  })
}

/* 转发 */
wx.showShareMenu({withShareTicket: true})
wx.onShareAppMessage(() => ({
  title: '这游戏谁比我玩得 6 ',
  imageUrl: 'https://static.lufei.so/colloc/images/' + [
    'share.1.png',
    'share.2.png',
    'share.3.png',
    'share.4.png',
    'share.5.png',
  ][Math.random() * 5 | 0]
}))

/* 订阅更新 */
call({
  name: 'subscribe'
}).then(({included}) => {
  if (included) return

  wx.onTouchEnd(handle)

  function handle() {
    const id = 'R-8k_AqowrAUy28Ca-fIdy-H25rJEu6M-6NKk8KPJCw'
    wx.offTouchEnd(handle)
    wx.requestSubscribeMessage({
      tmplIds: [id],
      success: async ({[id]: result}) => {
        if (!store.id || result === 'reject') return
        call({
          name: 'subscribe',
          data: {subscribe: true}
        })
      }
    })
  }
})
