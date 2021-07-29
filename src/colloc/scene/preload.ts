import {loader} from '~/core'
import {cloud, fs} from '~/module/wx'
import {createPromise, store} from '~/util'

export default async function() {
  const [promise, resolve] = createPromise()
  const dirs = ['font', 'sound', 'texture']

  loader
    .reset()
    .add('colloc/static/texture/ui.json')
    .add('colloc/static/texture/item.json')
    .load(resolve)

  for (const dir of dirs) {
    const [existed] = await fs.access(dir)
    if (!existed) await fs.mkdir(dir)
  }

    // 加载网络资源并存入本地
  const files = [
    {name: 'sound/bgm.mp3', v: '1.0.0'},
    {name: 'sound/win.mp3', v: '1.0.0'},
    {name: 'sound/tap.mp3', v: '1.0.1'},
    {name: 'sound/fail.mp3', v: '1.0.0'},
    {name: 'sound/collide.mp3', v: '1.0.0'},
    {name: 'sound/transfer.mp3', v: '1.0.0'},
    {name: 'sound/collide.once.mp3', v: '1.0.0'},
    {name: 'sound/collide.gear.mp3', v: '1.0.0'},
    {name: 'sound/collide.green.mp3', v: '1.0.0'},
    {name: 'sound/collide.arrow.mp3', v: '1.0.0'},
    {name: 'font/RalewaySemiBold.ttf', v: '1.0.1'}
  ]

  for (const item of files) {
    const [existed] = await fs.access(item.name)
    const outdated = compare(store.colloc.files[item.name], item.v)

    if (!existed || outdated) {
      const [tp] = await cloud.download(`${CDN}/${item.name}`)
      if (!tp) continue
      const [path] = await fs.save(tp, item.name)
      if (!path) continue
      store.colloc.files[item.name] = item.v
    }
  }

  window.font = wx.loadFont(`${fs.root}/font/RalewaySemiBold.ttf`)

  return promise
}

function compare(v1: string = '', v2: string = '') {
  const s1 = v1.split('.')
  const s2 = v2.split('.')
  const length = Math.max(s1.length, s2.length)
  for (let i = 0; i < length; i++) {
    const c1 = +s1[i] || 0
    const c2 = +s2[i] || 0
    if (c1 < c2) return -1
    if (c1 > c2) return 1
    if (i === length - 1) return 0
  }
}
