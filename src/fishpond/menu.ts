import {animate} from 'popmotion'

import {screen} from '~/core'

let menu: PIXI.Sprite
let parent: PIXI.Container

export function show(opts: {parent: PIXI.Container}) {
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

  const subs = ['info', 'sale', 'up', 'voice'].map((id, i, {length}) => {
    const half = length / 2
  })
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
}

export function on(name: string, cb: (...args: []) => void) {
  menu.on(name, cb)
}

interface IMenu extends PIXI.Sprite {
  stop?: Function
}
