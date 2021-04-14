import {fs, cloud} from './wx'

const cache: {[k: string]: wx.IInnerAudioContext} = {}
const prefix = 'sound'

export function play(id: string, opt: {volume?: number, loop?: boolean } = {}) {
  const sound = cache[id] || wx.createInnerAudioContext()
  sound.volume = opt.volume ?? 1
  getSrc(id).then(src => {
    console.log(src)
    sound.src = src
    sound.seek(0)
    sound.play()
  })
  return cache[id] = sound
}

export function load(id: string, opt: {volume?: number, loop?: boolean} = {}) {
  const sound = cache[id] || wx.createInnerAudioContext()
  sound.loop = opt.loop
  sound.volume = opt.volume ?? 1
  sound.src = `${prefix}/${id}`
  return cache[id] = sound
}

function getSrc(id: string) {
  const path = `${prefix}/${id}`
  return fs.access(path).then(([result, err]) => {
    if (err) {
      cloud.download(`${CDN}/sound/${id}`).then(([result, err]) => {
        if (err) return wx.showToast({title: err.message, icon: 'error'})
        fs.save(result, `sound/${id}`).then(console.log)
      })
      return `${CDN}/sound/${id}`
    }
    return `${fs.root}/${path}`
  })
}
