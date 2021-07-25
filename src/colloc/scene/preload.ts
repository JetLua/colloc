import {loader} from '~/core'
import {cloud, fs} from '~/module/wx'
import {createPromise} from '~/util'

export default async function() {
  const [promise, resolve] = createPromise()

  loader
    .reset()
    .add('colloc/static/texture/ui.json')
    .add('colloc/static/texture/item.json')
    .load(resolve)

    // 加载网络资源并存入本地
  const files = ['font/Raleway-SemiBold.ttf']

  for (const item of files) {
    const [ok] = await fs.access(item)
    if (ok) continue
    const [tp] = await cloud.download(`${CDN}/${item}`)
    if (!tp) continue
    await fs.save(tp, item)
  }

  window.font = wx.loadFont(`${fs.root}/font/Raleway-SemiBold.ttf`)

  return promise
}
