import * as PIXI from 'pixi.js'

const bubbles: PIXI.Sprite[] = []

/**
 * 获取泡泡
 */
export function get() {
  const bubble = bubbles.pop() ?? PIXI.Sprite.from('zero.bubble.png')
  return bubble
}

/**
 * 回收泡泡
 */
export function put(bubble: PIXI.Sprite) {
  bubble.parent.removeChild(bubble)
  bubbles.push(bubble)
}
