import {screen} from '~/core'

export {default as store} from './store'
export {default as createPromise} from './createPromise'

export function ok<T>(result: T): [T, null] {
  return [result, null]
}

export function error(result: any): [null, Error] {
  return [null, result instanceof Error ? result : new Error(result)]
}

export function mixin<T extends new (...args: any[]) => unknown>(ctor: T, ...bases: any[]) {
  bases.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        ctor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null)
      )
    })
  })
  return ctor
}

export function delay(t = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, t * 1e3)
  })
}

export function align(opts: IAlign) {
  const {target, parent} = opts
  const delta = {x: 0, y: 0}
  const rect = target.getBounds(false)

  if (parent) {

  }

  if (opts.top != null) delta.y = opts.top - rect.top
  else if (opts.bottom != null) delta.y = screen.height - opts.bottom - rect.bottom
  else delta.y = (screen.height - rect.top - rect.bottom) / 2

  if (opts.left != null) delta.x = opts.left - rect.left
  else if (opts.right != null) delta.x = screen.width - opts.right - rect.right
  else delta.x = (screen.width - rect.left - rect.right) / 2

  target.x += delta.x / target.parent.scale.x
  target.y += delta.y / target.parent.scale.y
}

interface IAlign {
  target: PIXI.DisplayObject
  parent?: PIXI.Container
  top?: number
  left?: number
  right?: number
  bottom?: number
}
