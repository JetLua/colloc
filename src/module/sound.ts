import {fs, cloud} from './wx'

const cache: {[k: string]: wx.IInnerAudioContext} = {}
const prefix = 'sound'

export function play(id: string, opts: {volume?: number, loop?: boolean, reset?: boolean} = {}) {
  if (cache[id]) {
    const sound = cache[id]
    sound.volume = opts.volume ?? 1
    opts.reset ??= true
    // opts.reset && sound.seek(0)
    // android seek 有问题
    opts.reset && sound.stop()
    sound.play()
    return sound
  } else {
    const sound = cache[id] = wx.createInnerAudioContext({useWebAudioImplement: true})
    sound.volume = opts.volume ?? 1
    sound.src = `${fs.root}/${prefix}/${id}`
    sound.loop = opts.loop
    sound.autoplay = true
    return sound
  }
}

export function pause(id: string) {
  const sound = cache[id]
  if (!sound) return
  !sound.paused && sound.pause()
}

function getSrc(id: string) {
  const path = `${prefix}/${id}`
  return fs.access(path).then(([result, err]) => {
    if (err) {
      cloud.download(`${CDN}/sound/${id}`).then(([result, err]) => {
        if (err) return wx.showToast({title: err.message, icon: 'error'})
        fs.save(result, `sound/${id}`)
      })
      return `${CDN}/sound/${id}`
    }
    return `${fs.root}/${path}`
  })
}
