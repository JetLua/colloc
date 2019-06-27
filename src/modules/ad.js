const ad = wx.createRewardedVideoAd({
  adUnitId: 'adunit-035f929608f8c858'
})

let resolve, reject

ad.onError(err => {
  wx.showToast({title: err.errMsg, icon: 'none'})
})

ad.onClose(({isEnded}) => {
  resolve(isEnded)
})

export function show() {
  const promise = new Promise((a, b) => {
    resolve = a
    reject = b
  })

  ad.show().catch(err => {
    ad.load()
      .then(() => ad.show())
      .catch(reject)
  })

  return promise
}