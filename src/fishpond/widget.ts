import {animate} from 'popmotion'
import {screen} from '~/core'

const icons: PIXI.Sprite[] = []
let visible = false

export function show(opts?: {parent: PIXI.Container}) {
  opts && init(opts)
  for (const icon of icons) {
    icon.visible = true
    icon.alpha = 0
    animate({
      from: {y: icon.y, alpha: 0},
      to: {y: icon.y - 30, alpha: 1},
      duration: 5e2,
      onUpdate: v => {
        icon.y = v.y
        icon.alpha = v.alpha
      },
      onComplete: () => {
        visible = true
      }
    })
  }
}

export function hide() {
  for (const icon of icons) {
    animate({
      from: {y: icon.y, alpha: 1},
      to: {y: icon.y + 30, alpha: 0},
      duration: 5e2,
      onUpdate: v => {
        icon.y = v.y
        icon.alpha = v.alpha
      },
      onComplete: () => {
        visible =
        icon.visible = false
      }
    })
  }
}

export function toggle() {
 visible ? hide() : show()
}

export function init(opts: Parameters<typeof show>[0]) {
  // 左边
  ['carbon', 'oxygen', 'sum', 'usage'].forEach((id, i, {length}) => {
    const icon = PIXI.Sprite.from(`zero.icon.${id}.png`)
    const half = length / 2 - .5

    icon.x = icon.width / 2 + 10
    icon.y = screen.height / 2 + (icon.height + 30) * (i - half)
    icon.y += 30
    icon.visible = false

    icons.push(icon)
    opts.parent.addChild(icon)
  })

  // 右边
  void ['feed', 'fish'].forEach((id, i, {length}) => {
    const icon = PIXI.Sprite.from(`zero.icon.${id}.png`)
    const half = length / 2 - .5

    icon.x = screen.width - icon.width / 2 - 10
    icon.y = screen.height / 2 + (icon.height + 30) * (i - half)
    icon.y += 30
    icon.visible = false

    icons.push(icon)
    opts.parent.addChild(icon)
  })
}
