import store from '../store'
import {monitor, device} from '../../core'
import * as cloud from './cloud'

wx.onShow(info => monitor.emit('wx:show', info))

/* 开启转发 */
wx.showShareMenu({withShareTicket: true})
wx.onShareAppMessage(() => ({
  title: '从未停止对美好事物的探索...',
  query: `id=${store.id}`,
  imageUrl: [
    'https://static.lufei.so/colloc/snapshot/1.png'
  ][~~(Math.random() * 1)]
}))

monitor.on('wx:share', () => {
  wx.shareAppMessage({
    title: '从未停止对美好事物的探索...',
    query: `id=${store.id}`,
    imageUrl: [
      'https://static.lufei.so/colloc/snapshot/1.png'
    ][~~(Math.random() * 1)]
  })
})

function login() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success({userInfo, cloudID}) {
        resolve({
          cloudID,
          user: {
            name: userInfo.nickName,
            avatar: userInfo.avatarUrl,
            city: userInfo.city,
            gender: userInfo.gender
          }
        })
      },

      fail() {
        const btn = wx.createUserInfoButton({
          type: 'text',
          text: '',
          style: {
            left: 0,
            top: 0,
            width: device.width,
            height: device.height,
            backgroundColor: 'transparent'
          }
        })

        btn.onTap(({userInfo, cloudID}) => {
          btn.destroy()
          userInfo ? resolve({
            cloudID,
            user: {
              name: userInfo.nickName,
              avatar: userInfo.avatarUrl,
              city: userInfo.city,
              gender: userInfo.gender
            }
          }) : reject({msg: '拒绝授权'})
        })
      }
    })
  })
}

export {
  cloud,
  login
}

