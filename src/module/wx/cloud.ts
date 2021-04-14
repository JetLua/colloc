import {error, ok} from '~/util'

wx.cloud.init({env: CLOUD_ID})

export function download(url: string, config?: {env: string}) {
  return new Promise<[string, Error]>((resolve) => {
    wx.cloud.downloadFile({
      fileID: url,
      config,
      success: ({tempFilePath}) => resolve(ok(tempFilePath)),
      fail: ({errMsg}) => resolve(error(errMsg))
    })
  })
}
