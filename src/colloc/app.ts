import {store} from '~/util'
import {sound} from '~/module'
import {monitor} from './module'
import {monitor as globalMonitor} from '~/core'
import {preload, game, entry, selector, setting} from './scene'

globalMonitor.once('wx:show', async () => {
  wx.showLoading({title: '正在加载...'})
  await preload()
  wx.hideLoading()

  const stack: {cursor: IScene, args: any[]}[] = []

  monitor.on('scene:go', (name: string, ...args: any[]) => {
    const cursor: IScene = {game, entry, selector, setting}[name]
    stack[stack.length - 1]?.cursor.hide()
    cursor.show(...args)
    stack.push({cursor, args})
  }).on('scene:back', () => {
    if (stack.length < 2) return monitor.emit('scene:go', 'entry')
    stack.pop().cursor.hide()
    const {cursor, args} = stack[stack.length - 1]
    cursor.show(...args)
  })

  monitor.emit('scene:go', 'entry', 2, 0)

}).on('wx:show', () => {
  store.colloc.settings.music &&
  sound.play('bgm.mp3', {loop: true, reset: false})
  window.interaction = new Promise(resolve => {
    resolve(wx.getMenuButtonBoundingClientRect())
  })
}).on('store', () => {
  store.colloc.settings.music ?
    sound.play('bgm.mp3', {loop: true, reset: false}) :
    sound.pause('bgm.mp3')
})
