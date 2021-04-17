import {animate, easeOut} from 'popmotion'
import {createPromise} from '~/util'

const bubbles: Bubble[] = []
const ripples: Ripple[] = []

/**
 * 获取泡泡
 */
export function get() {
  const bubble = bubbles.pop() || new Bubble()
  return bubble
}

/**
 * 回收泡泡
 */
export function put(bubble: Bubble) {
  bubble.parent.removeChild(bubble)
  bubbles.push(bubble)
}

class Bubble extends PIXI.Container {
  items: PIXI.Sprite[]

  constructor() {
    super()
    this.zIndex = 2
    this.items = Array.from({length: 3}, () => PIXI.Sprite.from('zero.bubble.png'))
    this.addChild(...this.items)
  }

  async animate(opts: {duration: number, onComplete: Function}) {
    for (let i = 0; i < this.items.length; i++) {
      const [promise, resolve] = createPromise()
      const item = this.items[i]
      item.scale.set(0)
      item.visible = true
      animate({
        from: {y: 0, scale: 0, _t: 0},
        to: {y: -80, scale: 1, _t: 1},
        duration: opts.duration * 1e3,
        onUpdate: v => {
          item.scale.set(v.scale)
          item.y = v.y
          v._t > .3 && resolve()
        },
        onComplete: () => {
          item.visible = false
          const ripple = ripples.pop() || new Ripple()
          ripple.y = -80
          this.addChild(ripple)
          ripple.animate(() => {
            if (i !== this.items.length - 1) return
            put(this)
            opts.onComplete()
          })
        }
      })

      await promise
    }
  }
}

class Ripple extends PIXI.Sprite {
  constructor() {
    super(PIXI.Texture.from('zero.ripple.png'))
  }

  animate(onComplete: () => void) {
    animate({
      from: {scale: .3, alpha: 1},
      to: {scale: 3, alpha: .1},
      duration: 1e3,
      ease: easeOut,
      onUpdate: v => {
        this.alpha = v.alpha
        this.scale.set(v.scale)
      },
      onComplete: () => {
        this.parent.removeChild(this)
        ripples.push(this)
        onComplete()
      }
    })
  }
}
