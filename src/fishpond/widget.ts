import {animate} from 'popmotion'
import {screen} from '~/core'
import {createPromise, store} from '~/util'

const icons: IIcon[] = []
const {data} = store.fishpond

let visible = false
let toggling = false

export async function show(opts?: {parent: PIXI.Container}) {
  opts && init(opts)

  if (toggling) return
  toggling = true
  visible = true

  await Promise.all(icons.map((icon, i) => {
    const [promise, resolve] = createPromise()

    icon.visible = true
    icon.alpha = 0

    const dx = i < 4 ? -100 : 100
    const dt = i < 4 ? i * 1e2 : (i - 4) * 1e2

    animate({
      from: {x: icon.dst + dx, alpha: 0},
      to: {x: icon.dst, alpha: 1},
      duration: 3e2 + dt,
      onUpdate: v => {
        icon.x = v.x
        icon.alpha = v.alpha
      },
      onComplete: () => {
        visible = true
        resolve()
      }
    })

    return promise
  })).then(() => toggling = false)

  return true
}

export async function hide() {
  if (toggling) return
  toggling = true
  visible = false

  await Promise.all(icons.map((icon, i) => {
    const [promise, resolve] = createPromise()

    const dx = i < 4 ? -100 : 100
    const dt = i < 4 ? i * 1e2 : (i - 4) * 1e2

    animate({
      from: {x: icon.x, alpha: 1},
      to: {x: icon.dst + dx, alpha: 0},
      duration: 3e2 + dt,
      onUpdate: v => {
        icon.x = v.x
        icon.alpha = v.alpha
      },
      onComplete: () => {
        visible =
        icon.visible = false
        resolve()
      }
    })

    return promise
  })).then(() => toggling = false)

  return true
}

export function toggle() {
  return visible ? hide() : show()
}

export function init(opts: Parameters<typeof show>[0]) {
  // 左边
  const textStyle = {
    fill: 0xffffff,
    fontFamily: window.font,
    fontWeight: 'bolder',
    fontSize: 32
  } as PIXI.ITextStyle

  ['carbon', 'oxygen', 'money', 'capacity'].forEach((id, i, {length}) => {
    const icon = PIXI.Sprite.from(`zero.icon.${id}.png`) as IIcon
    const half = length / 2 - .5
    const value = new PIXI.Text(getValue(id), textStyle)

    value.anchor.set(0, .5)
    value.position.set(icon.width / 2 + 10, 0)
    icon.addChild(value)

    icon.dst = icon.width / 2 + 10
    icon.y = screen.height / 2 + (icon.height + 30) * (i - half)
    icon.visible = false

    icons.push(icon)
    opts.parent.addChild(icon)
  })

  // 右边
  void ['feed', 'fish'].forEach((id, i, {length}) => {
    const icon = PIXI.Sprite.from(`zero.icon.${id}.png`) as IIcon
    const half = length / 2 - .5

    icon.dst = screen.width - icon.width / 2 - 10
    icon.y = screen.height / 2 + (icon.height + 30) * (i - half)
    icon.visible = false

    icons.push(icon)
    opts.parent.addChild(icon)
  })
}

function getValue(name: string) {
  switch (name) {
    case 'carbon': {
      return `${(data.carbon * 100) | 0}%`
    }

    case 'oxygen': {
      return `${(data.oxygen * 100) | 0}%`
    }

    case 'money': {
      return `${data.money}`
    }

    case 'capacity': {
      return `${data.capacity.used}/${data.capacity.total}`
    }
  }
}

interface IIcon extends PIXI.Sprite {
  dst: number
}
