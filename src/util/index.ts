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
