import {fs, cloud} from './wx'

const cache: {[k: string]: wx.IInnerAudioContext} = {}
const prefix = 'sound'

export function play(id: string, opts: {volume?: number, loop?: boolean, reset?: boolean} = {}) {
  if (cache[id]) {
    const sound = cache[id]
    sound.volume = opts.volume
    opts.reset && sound.seek(0)
    sound.paused && sound.play()
    return sound
  } else {
    const sound = cache[id] = wx.createInnerAudioContext()
    sound.volume = opts.volume ?? 1
    getSrc(id).then(src => {
      sound.src = src
      sound.loop = opts.loop
      sound.autoplay = true
    })
    return sound
  }
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
