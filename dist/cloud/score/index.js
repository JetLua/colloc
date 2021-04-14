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
  let level, step
  if (data) {
    // 升关卡则无视step
    level = data.score && data.score.level || 0
    step = data.score && data.score.step || Number.MAX_SAFE_INTEGER
    if (e.level > level) {
      level = e.level
      step = e.step
    } else if (e.level === level && e.step < step) {
      step = e.step
    }
  } else {
    level = e.level
    step = e.step
  }
  if (data._id) return update(id, {score: {step, level}}).then(() => true)
  return update(id, {score: {step, level}}, true).then(() => true)
}

function query(id) {
  return user.where({_id: id}).get().then(({data}) => {
    return data[0]
  })
}

function update(id, data, set) {
  return user.doc(id).update({
    data: set ? _.set(data) : data
  })
}
