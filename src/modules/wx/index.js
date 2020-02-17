import {screen} from '../../core'

wx.cloud.init({
  env: CLOUD_ID
})

export const db = wx.cloud.database()

const fs = wx.getFileSystemManager()
export const ROOT = wx.env.USER_DATA_PATH

/**
 *
 * @param {string} fid - 文件id
 * @param {string} path - 保存到本地路径
 */
export async function download(fid, path) {
  const existed = await access(path).catch(() => false)
  if (existed) return `${ROOT}/${path}`

  return new Promise((resolve, reject) => {
    wx.cloud.downloadFile({
      fileID: fid,
      fail: reject,
      success: ({tempFilePath}) => {
        fs.saveFile({
          tempFilePath,
          filePath: `${ROOT}/${path}`,
          fail: reject,
          success: ({savedFilePath}) => resolve(savedFilePath),
        })
      }
    })
  })
}

export function read(path, encoding = 'utf-8', tidy = true) {
  return new Promise((resolve, reject) => {
    fs.readFile({
      filePath: tidy ? `${ROOT}/${path}` : path,
      encoding,
      success: ({data}) => resolve(data),
      fail: reject
    })
  })
}

export function write(path, data, encoding) {
  return new Promise((resolve, reject) => {
    fs.writeFile({
      filePath: `${ROOT}/${path}`,
      data,
      encoding,
      success: resolve,
      fail: reject
    })
  })
}

export function access(path) {
  return new Promise((resolve, reject) => {
    fs.access({
      path: `${ROOT}/${path}`,
      fail: reject,
      success: resolve,
    })
  })
}

export async function mkdir(path, recursive = true) {
  const existed = await access(path).catch(() => false)
  if (existed) return true

  return new Promise((resolve, reject) => {
    fs.mkdir({
      dirPath: `${ROOT}/${path}`,
      recursive,
      success: resolve,
      fail: reject
    })
  })
}

export const ad = {
  cache: {},

  create(id, type, onError) {
    switch (type) {
      case 'video': {
        this.cache[id] = wx.createRewardedVideoAd({
          adUnitId: id
        })
        this.cache[id].onError(onError)
        break
      }

      case 'splash': {
        this.cache[id] = wx.createInterstitialAd({
          adUnitId: id
        })
        this.cache[id].onError(onError)
        break
      }
    }

    return this.cache[id]
  },

  show(id, type) {
    let resolve, reject
    const ad = this.cache[id] || this.create(id, type, err => reject(err))
    const promise = new Promise((a, b) => {
      resolve = a
      reject = b
    })

    switch (type) {
      case 'video': {
        ad
          .load()
          .then(() => ad.show())
          .then(() => {
            ad.onClose(onClose)
            function onClose({isEnded}) {
              resolve(isEnded)
              ad.offClose(onClose)
            }
          })
          .catch(reject)
        break
      }

      case 'splash': {
        ad
          .show()
          .then(resolve)
          .catch(reject)
        break
      }
    }

    return promise
  }
}

export async function login() {
  let info = await new Promise((resolve, reject) => {
    wx.getUserInfo({
      fail: reject,
      success: resolve,
      withCredentials: false,
    })
  }).catch(() => null)

  if (info?.userInfo) return info.userInfo

  const btn = wx.createUserInfoButton({
    type: 'text',
    text: '',
    style: {
      left: 0,
      top: 0,
      width: screen.width,
      height: screen.height,
      backgroundColor: 'transparent'
    }
  })

  return new Promise((resolve, reject) => {
    btn.onTap(({userInfo}) => {
      btn.destroy()
      if (!userInfo) return reject('拒绝授权')
      resolve(userInfo)
    })
  })
}

export async function call({data, name}) {
  return await wx.cloud.callFunction({
    data,
    name,
  }).then(({result}) => result)
}