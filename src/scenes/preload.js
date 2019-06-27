import {loader} from '../core'

/* 加载字体 */
wx.loadFont('static/fonts/Raleway-SemiBold.ttf')

export default function () {
  return new Promise(resolve => {
    loader.baseUrl = 'static'
    loader
      .add('textures/ui.json')
      .add('textures/item.json')
      .load(resolve)
  })
}




