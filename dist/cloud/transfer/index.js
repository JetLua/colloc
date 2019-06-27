// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
// exports.main = ({userInfo}) => {
//   return userInfo
// }

exports.main = () => {
  return cloud.getWXContext()
}