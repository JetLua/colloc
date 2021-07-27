import merge from 'deepmerge'

let store = {
  fishpond: {
    settings: {voice: 1, widget: 1},
    data: {
      carbon: .1,
      oxygen: .8,
      money: 100,
      capacity: {used: 3, total: 12}
    }
  },
  colloc: {
    level: 25,
    files: {} as {[k: string]: string},
    settings: {voice: 1, music: 1},
  }
}

try {
  store = merge(store, JSON.parse(localStorage.getItem('store')))
} catch (err: any) {
  console.log(err.message)
}

const queue = new WeakSet()
const handle = {
  get(target: any, k: any) {
    let v = target[k]
    if (v && typeof v === 'object' && !queue.has(v)) {
      v = target[k] = new Proxy(v, handle)
      queue.add(v)
    }
    return v
  },

  set(target: any, k: any, v: any) {
    if (target[k] === v) return true
    if (v && typeof v === 'object' && !queue.has(v)) {
      v = new Proxy(v, handle)
      queue.add(v)
    }

    target[k] = v
    localStorage.setItem('store', JSON.stringify(store))
    return true
  }
}

export default new Proxy<typeof store>(store, handle)
