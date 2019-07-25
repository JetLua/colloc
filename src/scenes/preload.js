import {loader} from '../core'
import {store} from '../modules'

/* 加载字体 */
store.font = wx.loadFont('static/fonts/Raleway-SemiBold.ttf') || 'sans-serif'

export default function () {
  return new Promise(resolve => {
    loader.baseUrl = 'static'
    loader
      .add('textures/ui.json')
      .add('textures/item.json')
      .load(resolve)
  })
}
