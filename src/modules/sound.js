import {EventEmitter} from 'events'

class Sound extends EventEmitter {
  get paused() {
    return this.ctx?.paused
  }

  constructor(src, {volume = 1, loop = false, autoplay}) {
    super()

    this.ctx = wx.createInnerAudioContext()
    this.ctx.src = src
    this.ctx.loop = loop
    this.ctx.volume = volume
    this.ctx.autoplay = autoplay

    !loop && this.ctx.onEnded(() => this.destroy())
    this.ctx.onError(() => this.destroy())
  }

  play() {
    this.ctx?.play()
  }

  stop() {
    this.ctx?.stop()
  }

  pause() {
    this.ctx?.pause()
  }

  destroy() {
    if (!this.ctx) return
    this.ctx.destroy()
    this.ctx = null
  }
}

export function load(src, opt = {autoplay: false}) {
  const sound = new Sound(src, opt)
  return sound
}

export function play(src, opt = {autoplay: true}) {
  const sound = new Sound(src, opt)
  return sound
}