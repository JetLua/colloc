import store from '../store'

wx.cloud.init({env: PIXI.settings.CLOUD_ENV})

const
  db = wx.cloud.database(),
  user = db.collection('user')

function find(opt) {
  return user
    .where(opt).get()
    .then(({data}) => data[0])
}

function transfer() {
  return wx.cloud.callFunction({
    name: 'transfer'
  }).then(({result: {OPENID}}) => OPENID)
}

function verify(id) {
  return wx.cloud.callFunction({
    name: 'verify',
    data: {id}
  })
}

function createActivityId() {
  return wx.cloud.callFunction({
    name: 'createActivityId'
  }).then(({result: {activityId}}) => activityId)
}

function set(data) {
  if (!store.id) return Promise.reject({msg: 'No id'})
  return user.doc(store.id).set({data})
}

function update(data) {
  if (!store.id) return Promise.reject({msg: 'No id'})
  return user.doc(store.id).update({data})
}

function get(opt) {
  if (!store.id) return Promise.reject({msg: 'No id'})
  return user.doc(store.id).field(opt).get()
}

export {
  get,
  set,
  find,
  update,
  verify,
  transfer,
  createActivityId
}