import * as PIXI from 'pixi.js'
import {DropShadowFilter} from '@pixi/filter-drop-shadow'

import {stage, loader, screen, ticker} from '~/core'

loader.add('static/texture/zero.json').load(main)

function main() {
  const {max, sin, cos, random, PI} = Math
  const PI2 = PI * 2
  const PI_2 = PI / 2

  const scene = new PIXI.Container()
  stage.addChild(scene)

  // 河床
  const bed = PIXI.Sprite.from('zero.bkg.jpg')
  bed.rotation = PI_2
  bed.scale.set(max(screen.width / bed.height, screen.height / bed.width))
  bed.position.set(screen.width / 2, screen.height / 2)
  scene.addChild(bed)

  // 波光粼粼
  const overlay = PIXI.TilingSprite.from('zero.overlay.png', {width: screen.width, height: screen.height})
  overlay.zIndex = 1
  overlay.position.copyFrom(bed.position)
  scene.addChild(overlay)

  // 潭中鱼可百许头
  const shadowFilter = new DropShadowFilter({distance: 12, quality: 1, rotation: 180})
  const fishes = Array.from({length: 16}, (_, i) => {
    const fish = PIXI.Sprite.from(`zero.fish.${i % 4 + 1}.png`) as IFish

    fish.interactive = true
    fish.speed = (1 + random()) * 2
    fish.direction = random() * PI2
    fish.turnSpeed = random() - .8

    fish.position.set(random() * screen.width, random() * screen.height)
    fish.anchor.set(.5)

    return scene.addChild(fish)
  })

  const bound = screen.clone().pad(100)

  ticker.add(() => {
    for (const fish of fishes) {
      if (fish.stopped) continue

      fish.direction += fish.turnSpeed * .01
      fish.direction %= PI2
      fish.rotation = fish.direction
      fish.filters = [shadowFilter]

      fish.x -= cos(fish.rotation) * fish.speed
      fish.y -= sin(fish.rotation) * fish.speed

      fish.x < bound.left ? fish.x = bound.right :
      fish.x > bound.right ? fish.x = bound.left : 0

      fish.y < bound.top ? fish.y = bound.bottom :
      fish.y > bound.bottom ? fish.y = bound.top : 0
    }

    const {tilePosition} = overlay

    tilePosition.x += 1
    tilePosition.y += 1
    tilePosition.x %= 512
    tilePosition.y %= 512
  })

  const touches = {} as {[k: number]: IFish}
  scene.interactive = true
  scene.on('pointerdown', (e: IEvent) => {
    for (let i = fishes.length - 1; i > -1; i--) {
      const fish = fishes[i]
      const ok = fish.containsPoint(e)
      if (!ok) continue
      fish.stopped = {x: e.x, y: e.y}
      touches[e.id] = fish
      break
    }
  }).on('pointermove', (e: IEvent) => {
    const fish = touches[e.id]
    if (!fish) return
    fish.x += e.x - fish.stopped.x
    fish.y += e.y - fish.stopped.y
    fish.stopped.x = e.x
    fish.stopped.y = e.y
  }).on('pointerup', (e: IEvent) => {
    const fish = touches[e.id]
    if (!fish) return
    fish.stopped = null
    delete touches[e.id]
  })

  setTimeout(() => {
    wx.loadSubpackage({name: 'colloc'})
  }, 3000)
}

window.interaction = new Promise(resolve => {
  wx.onTouchStart(function handle() {
    wx.offTouchStart(handle)
    resolve(wx.getMenuButtonBoundingClientRect())
  })
})

interface IFish extends PIXI.Sprite {
  stopped?: {x: number, y: number}
  speed?: number
  direction?: number
  turnSpeed?: number
}
