// @ts-nocheck
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: 'sokoban-j5n2j'})

const db = cloud.database()
const user = db.collection('user')
const _ = db.command

// 云函数入口函数
exports.main = async e => {
  const list = await db.collection('user')
    .orderBy('score.level', 'desc')
    .orderBy('score.step', 'asc')
    .skip(e.cursor * 8)
    .limit(8)
    .field({user: true, score: true})
    .get()
    .then(({data}) => data)
    .catch(() => null)

  const total = await db.collection('user')
    .count()
    .then(({total}) => total)
    .catch(() => 0)

  return {list, next: total > (e.cursor + 1) * 8}
}
