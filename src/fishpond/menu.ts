import {animate} from 'popmotion'

import {screen} from '~/core'
import {createPromise} from '~/util'

const r = 200
const btns: IBtn[] = []

let menu: PIXI.Sprite
let parent: PIXI.Container
let visible = false
let animating = false

export function show(opts?: {parent: PIXI.Container}) {
  opts && init(opts)

  if (animating) return
  animating = true

  Promise.all(btns.map(btn => {
    const [promise, resolve] = createPromise()

    btn.alpha = 0
    btn.visible = true

    animate({
      from: {x: btn.x, y: btn.y, alpha: 0},
      to: {x: btn.dst.x, y: btn.dst.y, alpha: 1},
      duration: 3e2,
      onUpdate: v => {
        btn.alpha = v.alpha
        btn.position.copyFrom(v)
        visible = true
      },
      onComplete: resolve
    })

    return promise
  })).then(() => animating = false)
}

export function hide() {
  if (animating) return
  animating = true

  Promise.all(btns.map(btn => {
    const [promise, resolve] = createPromise()

    animate({
      from: {x: btn.x, y: btn.y, alpha: 1},
      to: {x: menu.x, y: menu.y, alpha: 0},
      duration: 3e2,
      onUpdate: v => {
        btn.alpha = v.alpha
        btn.position.copyFrom(v)
      },
      onComplete: () => {
        btn.visible = false
        visible = false
        resolve()
      }
    })

    return promise
  })).then(() => animating = false)
}

function onMenuUp(e: IEvent) {
  const target = e.target as IMenu
  target.stop?.()
  target.interactive = false
  target.stop = animate({
    from: {scale: target.scale.x, rotation: target.rotation},
    to: {scale: 1, rotation: target.rotation + Math.PI / 2},
    duration: 3e2,
    onUpdate: v => {
      target.scale.set(v.scale)
      target.rotation = v.rotation
    },
    onComplete: () => target.interactive = true
  }).stop

  e.type === 'pointerup' && toggle()
}

export function on(name: string, cb: (...args: []) => void) {
  menu.on(name, cb)
}

export function toggle() {
  visible ? hide() : show()
}

export function init(opts: Parameters<typeof show>[0]) {
  parent = opts.parent

  menu = PIXI.Sprite.from('zero.btn.menu.png') as IMenu
  menu.interactive = true
  menu.zIndex = 5
  menu.position.set(screen.width / 2, screen.height - 100)
  parent.addChild(menu)

  menu.on('pointerdown', (e: IEvent) => {
    const target = e.target as IMenu
    target.stop?.()
    target.rotation = 0
    target.stop = animate({
      from: target.scale.x,
      to: target.scale.x * 1.2,
      duration: 3e2,
      onUpdate: v => {
        target.scale.set(v)
      }
    }).stop
  }).on('pointerup', onMenuUp).on('pointerupoutside', onMenuUp)

  const ids = ['info.1', 'sale', 'up', 'voice.1']
  const delta = Math.PI / (ids.length + 1)

  ids.map((id, i, {length}) => {
    const btn = PIXI.Sprite.from(`zero.btn.${id}.png`) as IBtn
    const rad = delta * (i + 1)
    const x = menu.x + Math.cos(rad) * -r
    const y = menu.y + Math.sin(rad) * -r
    btn.dst = {x, y}
    btn.interactive = true
    btn.on('pointerdown', (e: IEvent) => {
      const target = e.currentTarget
      animate({
        from: btn.scale.x,
        to: btn.scale.x + .1,
        duration: 2e2,
        onUpdate: v => target.scale.set(v)
      })
    }).on('pointerup', onBtnUp)
    btn.scale.set(.8)
    btn.zIndex = 5
    btn.visible = false
    btn.position.set(menu.x, menu.y)
    btns.push(btn)
    parent.addChild(btn)
  })
}

function onBtnUp(e: IEvent) {
  const target = e.currentTarget
  animate({
    from: {scale: target.scale.x, rotation: target.rotation},
    to: {scale: .8, rotation: target.rotation + Math.PI * 2},
    duration: 3e2,
    onUpdate: v => {
      target.rotation = v.rotation
      target.scale.set(v.scale)
    },
    onComplete: () => {

    }
  })
}

interface IMenu extends PIXI.Sprite {
  stop?: Function
}

interface IBtn extends PIXI.Sprite {
  dst?: PIXI.IPointData
}
