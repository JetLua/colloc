// @ts-nocheck
/// <reference path="../../../module.d.ts"/>
wx.onMessage(data => {
  switch (data.type) {
    case 'update': {
      load(render)
      break
    }

    case 'click': {
      const {x, y} = data
      console.log(x, y, rect.next)
      if (rect.next && inside(x, y, rect.next)) {
        console.log('next')
        cursor++
        load(render)
      } else if (rect.prev && inside(x, y, rect.prev)) {
        cursor--
        load(render)
        console.log('prev')
      }
      break
    }
  }
})

const size = 8
const canvas = wx.getSharedCanvas()
const ctx = canvas.getContext('2d')
const lineHeight = 100
const rect = {next: null, prev: null}
const padding = {
  left: 20,
  right: 30
}

let cursor = 0
let loading = false

function render(data, next) {
  clear()
  for (let i = 0, j = data.length; i < j; i++) {
    const item = data[i]
    const img = wx.createImage()
    img.src = item.avatar
    img.onload = () => {
      ctx.drawImage(img, padding.left, (i + .5) * lineHeight - 30, 60, 60)
    }

    ctx.font = '30px/1.5 normal'
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(item.name, 60 + padding.left + 20, (i + .5) * lineHeight)

    ctx.font = 'bold 24px/1.5 normal'
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'bottom'
    ctx.fillText(`关卡: ${item.score}`, canvas.width - padding.right, (i + .5) * lineHeight - 4)

    ctx.font = '20px/1.5 normal'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'top'
    ctx.fillText(`步数: ${item.step}`, canvas.width - padding.right, (i + .5) * lineHeight + 4)
  }

  rect.next =
  rect.prev = null

  // 上一页
  if (cursor > 0) {
    ctx.font = '32px/1.5 normal'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const x = canvas.width / 2 - (next ? 80 : 0)
    const y = 8.5 * lineHeight
    ctx.fillText('上一页', x, y)
    const _rect = ctx.measureText('上一页')
    rect.prev = {
      x, y,
      width: _rect.width,
      height: _rect.actualBoundingBoxAscent + _rect.actualBoundingBoxDescent || 40
    }
  }

  // 下一页
  if (next) {
    ctx.font = '32px/1.5 normal'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const x = canvas.width / 2 + (cursor > 0 ? 80 : 0)
    const y = 8.5 * lineHeight
    ctx.fillText('下一页', x, y)
    const _rect = ctx.measureText('下一页')
    rect.next = {
      x, y,
      width: _rect.width,
      height: _rect.actualBoundingBoxAscent + _rect.actualBoundingBoxDescent || 40
    }
  }
}

function inside(x, y, rect) {
  const hw = rect.width / 2
  const hh = rect.height / 2
  if (x > rect.x - hw && x < rect.x + hw && y > rect.y - hh && y < rect.y + hh) return true
}

function load(cb) {
  if (loading) return
  loading = true
  tip('请求数据...')
  wx.getFriendCloudStorage({
    keyList: ['score'],
    fail: () => tip('数据获取失败'),
    complete: () => loading = false,
    success: ({data}) => {
      data = data.map(item => {
        let score, step
        for (const row of item.KVDataList) {
          if (row.key === 'score') {
            const json = JSON.parse(row.value)
            score = json.wxgame.score
            step = json.step
            break
          }
        }
        return {
          score, step,
          avatar: item.avatarUrl,
          name: item.nickname || item.openid
        }
      }).sort((a, b) => {
        const d = b.score - a.score
        if (d) return d
        return a.step - b.step
      })

      cb(data.slice(cursor * size, (cursor + 1) * size), data.length > (cursor + 1) * size)
    }
  })
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function tip(text) {
  clear()
  ctx.font = '32px sans-serif'
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
}
