// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const user = db.collection('user')

// 云函数入口函数
exports.main = async event => {
  const {OPENID: id} = cloud.getWXContext()
  const cmd = db.command.aggregate
  return user.aggregate()
    .replaceRoot({newRoot: {
      _id: '$_id',
      level: '$user.level',
      timestamp: '$timestamp'
    }})
    .sort({level: -1, timestamp: -1})
    .group({
      _id: null,
      all: cmd.push('$_id')
    })
    .project({
      id,
      alexa: cmd.indexOfArray(['$all', id])
    })
    .end()
    .then(({list}) => list[0])
}