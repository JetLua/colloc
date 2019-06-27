import {stage, ticker, monitor, screen} from './core'
import {entry, preload, game} from './scenes'
import {store, sound, wx as wechat} from './modules'
import dayjs from 'dayjs'

preload().then(() => {
  entry.show()
})

monitor.on('wx:show', ({query}) => {
  const id = query?.id
  id && wechat.cloud.verify(id).catch(console.log).then(console.log)
})


/* 游戏圈 */
{
  const button = wx.createGameClubButton({
    icon: 'white',
    style: {
      left: 10,
      top: screen.height * .2,
      width: 40,
      height: 40
    }
  })

  monitor
    .on('scene:show', name => name === 'entry' ? button.show() : button.hide())
    .on('scene:hide', name => name === 'entry' && button.hide())
}


/* 等待交互 */
{
  let resolve
  store.interaction = new Promise(a => resolve = a)
  wx.onTouchStart(handle)
  function handle() {
    resolve(wx.getMenuButtonBoundingClientRect())
    wx.offTouchStart(handle)
  }
}

/* 记录登录 */
{
  const {cloud, login} = wechat

  login().then(async info => {
    store.user = info.user

    let stuff = await cloud.transfer().catch(console.log)

    if (!stuff) return

    store.id = stuff

  }).catch(async () => {
    /* 拒绝授权 */
    let stuff = await cloud.transfer().catch(console.log)

    if (!stuff) return

    store.id = stuff
  }).then(async () => {
    if (!store.id) return

    let stuff = await cloud.find({_openid: store.id}).catch(console.log)

    if (stuff) {
      store.diamond = stuff.diamond || 0
      store.unlocked = stuff.unlocked || 1
      cloud.update({
        ...store.user,
        stamp: Date.now(),
        date: dayjs().format('YYYY/MM/DD HH:mm:ss')
      })
    } else {
      cloud.set({
        ...store.user,
        diamond: 3,
        invitees: [],
        stamp: Date.now(),
        date: dayjs().format('YYYY/MM/DD HH:mm:ss')
      })
    }
  })
}


/* BGM */
{
  const bgm = sound.load(
    'https://static.lufei.so/colloc/bgm.mp3',
    {volume: .5, loop: true}
  )

  store.setting.music && bgm.play()

  monitor
    .on('setting:music', ok => ok ? bgm.play() : bgm.pause())
    .on('ad:close', () => store.setting.music && bgm.paused && bgm.play())
    .on('wx:show', () => store.setting.music && bgm.paused && bgm.play())
}

monitor
  .on('scene:go', (name, opt) => {
    name === 'game' && game.show(opt)
    name === 'entry' && entry.show(opt)
  })



