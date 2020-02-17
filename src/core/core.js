let {
  windowWidth: width,
  windowHeight: height,
  pixelRatio: devicePixelRatio,
} = wx.getSystemInfoSync()

const ticker = PIXI.Ticker.shared
const loader = PIXI.Loader.shared
const stage = new PIXI.Container()
const design = {width: 750, height: 1334}
const monitor = new PIXI.utils.EventEmitter()
const pixelRatio = Math.min(2, devicePixelRatio)

const renderer = new PIXI.Renderer({
  view: canvas,
  antialias: true,
  backgroundColor: 0x171a24,
  width: width * pixelRatio,
  height: height * pixelRatio,
})

const zoom = {
  mix: [],
  get max() {return Math.max(...this.mix)},
  get min() {return Math.min(...this.mix)}
}

zoom.mix = [
  renderer.screen.width / design.width,
  renderer.screen.height / design.height
]

ticker.add(() => renderer.render(stage))

renderer.plugins.accessibility.destroy()
renderer.plugins.interaction.mapPositionToPoint = (point, x, y) => point.set(x * pixelRatio, y * pixelRatio)

export const screen = renderer.screen

export {
  zoom,
  stage,
  design,
  loader,
  ticker,
  monitor,
  renderer,
  pixelRatio,
  devicePixelRatio
}