// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const subscriber = db.collection('subscriber')
const $ = db.command.aggregate
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID: id} = cloud.getWXContext()
  if (event.subscribe) {
    return subscriber.doc('update').update({
      data: {
        users: _.push([id])
      }
    })
  }
  return subscriber.aggregate()
    .match({_id: 'update'})
    .project({
      included: $.in([id, '$users'])
    })
    .end()
    .then(({list}) => list[0])
}