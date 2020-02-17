// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const user = db.collection('user')

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID: id} = cloud.getWXContext()

  delete event.userInfo

  let data = await user.where({_id: id})
    .get()
    .then(({data}) => data[0])
    .catch(() => null)

  if (!data) {
    return user.doc(id).set({
      data: {
        timestamp: Date.now(),
        user: {
          level: event.level,
        }
      }
    })
  } else {
    return user.doc(id).update({
      data: {
        timestamp: Date.now(),
        user: {
          level: event.level
        }
      }
    })
  }
}