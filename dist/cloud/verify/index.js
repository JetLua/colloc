// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: 'colloc-dev'})

const user = cloud.database().collection('user')

// 云函数入口函数
exports.main = ({id}) => {
  const {OPENID} = cloud.getWXContext()
  if (id === OPENID || !id) return 'No id'
  return pull(id).then(({data: {invitees, diamond}}) => {
    if (invitees && invitees.indexOf(OPENID) !== -1) return 'invited'
    invitees ? invitees.push(OPENID) : invitees = [OPENID]
    diamond = diamond || 0
    diamond++
    return push(id, {invitees, diamond})
  }).catch(err => err.message)
}

function push(id, data) {
  return user.doc(id).update({
    data
  })
}

function pull(id) {
  return user.doc(id)
    .field({invitees: true, diamond: true}).get()
}
