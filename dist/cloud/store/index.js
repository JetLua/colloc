// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: 'sokoban-j5n2j'})

const db = cloud.database()
const user = db.collection('user')
const _ = db.command

// 云函数入口函数
exports.main = async e => {
  const {userInfo: {openId: id}} = e
  let data = await query(id).catch(() => null)
  if (data) {
    const level = data.score && data.score.level || 0
    const step = data.score && data.score.step || Number.MAX_SAFE_INTEGER

    if (e.data.score.leve > level) {

    } else if (e.data.score.leve === level && e.data.score.step < step) {

    } else {
      e.data.score.level = level
      e.data.score.step = step
    }
  }
  data = merge(data, e.data)
  data.timestamp = Date.now()
  if (data._id) return update(id, data).then(() => data)
  return set(id, data).then(() => data)
}

function query(id) {
  return user.where({_id: id}).get().then(({data}) => {
    return data[0]
  })
}

function update(id, data) {
  delete data._id
  return user.doc(id).update({data})
}

function set(id, data) {
  return user.doc(id).set({data})
}

function merge(a, b) {
  if (a == null) return b
  for (const k in b) {
    const oa = isObject(a[k])
    const ob = isObject(b[k])

    if (oa && ob) {
      merge(a[k], b[k])
      continue
    }

    b[k] != null && (a[k] = b[k])
  }
  return a
}

function isObject(o) {
  return Object.prototype.toString.call(o).includes('Object')
}
