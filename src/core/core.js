import './env'
import './layout'
import Ticker from './ticker'

const {
  devicePixelRatio,
  windowWidth: width,
  windowHeight: height,
} = wx.getSystemInfoSync()

const
  ticker = new Ticker(),
  loader = PIXI.Loader.shared,
  stage = new PIXI.Container(),
  design = {width: 750, height: 1334},
  monitor = new PIXI.utils.EventEmitter(),
  pixelRatio = Math.min(2, devicePixelRatio)


const
  renderer = new PIXI.Renderer({
    view: canvas,
    antialias: true,
    backgroundColor: 0x171a24,
    width: width * pixelRatio,
    height: height * pixelRatio,
  }),

  zoom = {
    mix: [],
    get max() { return Math.max(...this.mix) },
    get min() { return Math.min(...this.mix) }
  }

zoom.mix = [
  renderer.screen.width / design.width,
  renderer.screen.height / design.height
]

renderer.plugins.accessibility.destroy()
renderer.plugins.interaction.mapPositionToPoint = (point, x, y) => {
  point.set(x * pixelRatio, y * pixelRatio)
}

ticker.add(() => renderer.render(stage))

/**
 * 相对对齐
 * 在node比this大且是this子元素时无效
 */
PIXI.DisplayObject.prototype.align = function(node, opt = {}) {
  const
    delta = {x: 0, y: 0},
    rect1 = this.getBounds(false),
    rect2 = node.getBounds(false),
    {top, left, right, bottom} = opt

  if (top !== undefined) {
    delta.y = top - rect2.top + rect1.top
  } else if (bottom !== undefined) {
    delta.y = rect1.bottom - rect2.bottom - bottom
  } else {
    delta.y = ((rect1.top + rect1.bottom) - (rect2.top + rect2.bottom)) / 2
  }

  if (left !== undefined) {
    delta.x = left - rect2.left + rect1.left
  } else if (right !== undefined) {
    delta.x = rect1.right - rect2.right - right
  } else {
    delta.x = ((rect1.left + rect1.right) - (rect2.left + rect2.right)) / 2
  }

  node.x += delta.x / node.parent.scale.x
  node.y += delta.y / node.parent.scale.y
}

renderer.screen.align = function(node, opt = {}) {
  const
    delta = {x: 0, y: 0},
    rect = node.getBounds(false),
    {top, left, right, bottom} = opt

  if (top !== undefined) {
    delta.y = top - rect.top
  } else if (bottom !== undefined) {
    delta.y = this.height - bottom - rect.bottom
  } else {
    delta.y = (this.height - rect.top - rect.bottom) / 2
  }

  if (left !== undefined) {
    delta.x = left - rect.left
  } else if (right !== undefined) {
    delta.x = this.width - right - rect.right
  } else {
    delta.x = (this.width - rect.left - rect.right) / 2
  }

  node.x += delta.x / node.parent.scale.x
  node.y += delta.y / node.parent.scale.y
}

export const screen = renderer.screen
export const device = {width, height, pixelRatio: devicePixelRatio}

export {
  zoom,
  stage,
  design,
  loader,
  ticker,
  monitor,
  renderer,
  pixelRatio
}
