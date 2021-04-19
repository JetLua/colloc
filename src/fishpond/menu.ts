import {animate} from 'popmotion'

import {screen} from '~/core'
import {createPromise, delay, store} from '~/util'

const r = 200
const btns: IBtn[] = []
const {settings} = store.fishpond

let menu: IMenu
let parent: PIXI.Container

export function show(opts?: {parent: PIXI.Container}) {
  opts && init(opts)

  if (menu.toggling) return

  menu.toggling = true
  menu.folded = false

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
      },
      onComplete: resolve
    })

    return promise
  })).then(() => menu.toggling = false)
}

export function hide() {
  if (menu.toggling) return

  menu.toggling = true
  menu.folded = true

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
        resolve()
      }
    })

    return promise
  })).then(() => menu.toggling = false)
}

export function on(name: 'tap', onTap: (opts: {name: 'info' | 'voice', onComplete?: () => void}) => void) {
  menu.on(name, onTap)
}

export function toggle() {
  menu.folded ? show() : hide()
}

export function init(opts: Parameters<typeof show>[0]) {
  parent = opts.parent

  menu = PIXI.Sprite.from('zero.btn.menu.png') as IMenu
  menu.interactive = true
  menu.zIndex = 5
  menu.folded = true
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
  }).on('pointerup', menuUp).on('pointerupoutside', menuUp)

  const ids = ['info', 'sale', 'up', 'voice']
  const delta = Math.PI / (ids.length + 1)

  ids.map((id, i) => {
    const btn = PIXI.Sprite.from(`zero.btn.${getTexture(id)}.png`) as IBtn
    const rad = delta * (i + 1)
    const x = menu.x + Math.cos(rad) * -r
    const y = menu.y + Math.sin(rad) * -r
    btn.dst = {x, y}
    btn.interactive = true
    btn.name = id
    btn.on('pointerdown', (e: IEvent) => {
      const target = e.currentTarget as IBtn
      if (target.pressed) return
      target.pressed = true
      animate({
        from: btn.scale.x,
        to: btn.scale.x + .1,
        duration: 2e2,
        onUpdate: v => target.scale.set(v)
      })
    }).on('pointerup', btnUp).on('pointerupoutside', btnUp)
    btn.scale.set(.8)
    btn.zIndex = 5
    btn.visible = false
    btn.position.set(menu.x, menu.y)
    btns.push(btn)
    parent.addChild(btn)
  })
}

function getTexture(name: string) {
  switch (name) {
    case 'voice': {
      return `voice.${settings.voice}`
    }

    case 'info': {
      return `info.${settings.widget}`
    }

    default: return name
  }
}

function btnUp(e: IEvent) {
  const target = e.currentTarget as IBtn
  const eventType = e.type

  if (target.animating || !target.pressed) return
  target.animating = true

  animate({
    from: {scale: target.scale.x, rotation: target.rotation, _t: 0},
    to: {scale: .8, rotation: target.rotation + Math.PI * 2, _t: 1},
    duration: 3e2,
    onPlay: async () => {
      await delay(.15)
      switch (target.name) {
        case 'info': {
          settings.widget === 1 ? settings.widget = 2 : settings.widget = 1
          target.texture = PIXI.Texture.from(`zero.btn.${getTexture(target.name)}.png`)
          break
        }

        case 'voice': {
          settings.voice >= 4 ? settings.voice = 1 : settings.voice++
          target.texture = PIXI.Texture.from(`zero.btn.${getTexture(target.name)}.png`)
          break
        }
      }
    },

    onUpdate: v => {
      target.rotation = v.rotation
      target.scale.set(v.scale)
    },

    onComplete: () => {
      eventType === 'pointerup' && menu.emit('tap', {
        name: target.name,
        onComplete: () => {
          target.animating = false
          target.pressed = false
        }
      })
    }
  })
}

function menuUp(e: IEvent) {
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

interface IMenu extends PIXI.Sprite {
  stop: Function
  folded: boolean
  toggling: boolean
}

interface IBtn extends PIXI.Sprite {
  dst: PIXI.IPointData
  pressed: boolean
  animating: boolean
}
