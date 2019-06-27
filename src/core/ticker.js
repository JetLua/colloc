export default class {
  #tasks = []
  #id = null
  #last = 0
  #key = 0
  #fps = 60
  #interval = 1e3 / this.#fps | 0
  #active = false

  get fps() {return this.#fps}

  set fps(v) {
    this.#fps = v
    this.#interval = 1e3 / v | 0
  }

  constructor() {
    this.start()
  }

  add(fn, ctx = null) {
    this.#tasks.push([fn, ctx])
  }

  remove(fn, ctx = null) {
    let i = 0
    const tasks = this.#tasks
    for (const item of tasks) {
      if (item[0] === fn && item[1] === ctx) {
        tasks.splice(i, 1)
        break
      }
      i++
    }
  }

  start() {
    this.#active = true
    this.update()
  }

  stop() {
    this.#active = false
    cancelAnimationFrame(this.#id)
  }

  destroy() {
    this.stop()
    this.#tasks =
    this.#id =
    this.#last =
    this.#key =
    this.#interval =
    this.#fps = null
  }

  update() {
    if (!this.#active) return

    this.#id = requestAnimationFrame(this.update.bind(this))

    const
      last = this.#last,
      tasks = this.#tasks,
      now = performance.now()

    this.#last = now
    for (const task of tasks) {
      const [fn, ctx] = task
      fn.call(ctx, now - last)
    }
  }

  update() {
    if (!this.#active) return

    this.#id = requestAnimationFrame(this.update.bind(this))

    const
      interval = this.#interval,
      tasks = this.#tasks,
      last = this.#last,
      key = this.#key,
      now = performance.now() | 0,
      delta = now - key

    if (delta < interval) return

    this.#last = now
    this.#key = now - (delta % interval)
    for (const task of tasks) {
      const [fn, ctx] = task
      fn.call(ctx, now - last)
    }
  }
}