import {loader} from '~/core'
import {cloud, fs} from '~/module/wx'

export default async function() {
  await new Promise(resolve => {
    loader
      .add('static/texture/zero.json')
      .add('bkg.1.jpg', 'static/texture/bkg.1.jpg')
      .add('bkg.2.jpg', 'static/texture/bkg.2.jpg')
      .load(resolve)
  })

  // 检查本地文件夹路径
  const folders = ['font', 'texture', 'voice']

  for (const item of folders) {
    const [ok] = await fs.access(item)
    if (!ok) {
      const [ok, err] = await fs.mkdir(item)
      if (!ok) wx.showToast({title: err.message, icon: 'none'})
    }
  }

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
}
