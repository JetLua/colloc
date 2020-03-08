import store from './store'
import {ROOT} from './wx'

const baseUrl = `${ROOT}/sounds`

function _play({name, volume = 1, loop = false, autoplay = true}) {
  const sound = wx.createInnerAudioContext()
  sound.loop = loop
  sound.volume = volume
  sound.autoplay = autoplay
  sound.src = `${baseUrl}/${name}`
  return sound
}

export function play(opt) {
  if (!store.setting.voice) return
  _play(opt)
}

export const bgm = {
  get paused() {
    return this.instance.paused
  },

  play(opt) {
    this.instance = _play(opt)
  },

  resume() {
    this.instance.play()
  },

  pause() {
    this.instance.pause()
  },

  stop() {
    this.instance.stop()
  }
}