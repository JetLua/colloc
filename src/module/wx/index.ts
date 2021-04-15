import {monitor} from '~/core'

export * as fs from './fs'
export * as cloud from './cloud'

wx.onShow(params => {
  monitor.emit('wx:show', params)
})

wx.onHide(() => {
  monitor.emit('wx:hide')
})

wx.onAudioInterruptionEnd(() => {
  monitor.emit('wx:audio:interruption:end')
})
