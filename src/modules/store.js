let store = {
  timestamp: 0,
  user: {
    level: 0
  },
  setting: {
    music: true,
    voice: true,
  }
}

try {
  const _store = JSON.parse(localStorage.getItem('store'))

  if (!_store) throw null

  const queue = [[_store, store]]

  while (queue.length) {
    const [target, source] = queue.pop()
    for (const k in source) {
      const a = isObject(target[k])
      const b = isObject(source[k])

      if (a && b) {
        queue.push([target[k], source[k]])
        continue
      }

      if (a !== b) {
        target[k] = source[k]
        continue
      }

      if (!a && !b && !Reflect.has(target, k)) {
        target[k] = source[k]
        continue
      }
    }
  }
  store = _store
} catch {}

function isObject(o) {
  return Object.prototype.toString.call(o).includes('Object')
}

const queue = new WeakSet()

const handle = {
  get(target, key) {
    const value = target[key]
    if (value && typeof value === 'object' && !queue.has(value)) {
      target[key] = new Proxy(value, handle)
      queue.add(target[key])
    }
    return target[key]
  },

  set(target, key, value) {
    if (target[key] === value) return true

    if (target !== store || key !== 'timestamp') store.timestamp = Date.now()

    if (value && typeof value === 'object' && !queue.has(value)) {
      value = new Proxy(value, handle)
      queue.add(value)
    }

    target[key] = value

    localStorage.setItem('store', JSON.stringify(store))
    return true
  }
}

export default new Proxy(store, handle)
