import {animate} from 'popmotion'
import {sound} from '~/module'
import {store} from '~/util'

export default class extends PIXI.Sprite {
  #action: ReturnType<typeof animate>
  #zoom : [number, number]

  constructor(opts: Options) {
    super(PIXI.Texture.from(opts.id))

    this.#zoom = opts.zoom
    this.interactive = true
    this.scale.set(opts.zoom[0])

    this
      .on('pointerdown', this.onPointerDown)
      .on('pointerup', this.onPointerUp)
      .on('pointerupoutside', this.onPointerUp)
  }

  onPointerDown(e: IEvent) {
    store.colloc.settings.voice && sound.play('tap.mp3')
    this.#action?.stop()
    this.#action = animate({
      from: this.scale.x,
      to: this.#zoom[0] * this.#zoom[1],
      duration: 1e2,
      onUpdate: v => {
        this.scale.set(v)
      }
    })
  }

  onPointerUp(e: IEvent) {
    this.#action = animate({
      from: this.scale.x,
      to: this.#zoom[0],
      duration: 1e2,
      onUpdate: v => {
        this.scale.set(v)
      }
    })
  }
}

interface Options {
  id: string
  zoom: [number, number]
}
