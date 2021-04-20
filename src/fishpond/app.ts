import {DropShadowFilter} from '@pixi/filter-drop-shadow'

import {createPromise, delay, store} from '~/util'
import {stage, screen, ticker} from '~/core'

import Fish from './Fish'
import * as menu from './menu'
import preload from './preload'
import * as bubble from './bubble'
import * as widget from './widget'

await preload()

const {PI, max, random, cos, sin} = Math
const PI2 = PI * 2
const PI_2 = PI / 2
const {settings} = store.fishpond
const shadowFilter = new DropShadowFilter({distance: 12, quality: 1, rotation: 180})

const scene = new PIXI.Container()
stage.addChild(scene)

// 河床
const bed = PIXI.Sprite.from('bkg.1.jpg')
bed.rotation = PI_2
bed.anchor.set(.5)
bed.scale.set(max(screen.width / bed.height, screen.height / bed.width))
bed.position.set(screen.width / 2, screen.height / 2)
scene.addChild(bed)

void async function loop() {
  await Promise.all(Array.from({length: 3}, () => {
    const [promise, resolve] = createPromise()
    const x = 100 + (screen.width - 100) * random()
    const y = 100 + (screen.height - 100) * random()

    const bub = bubble.get()
    bub.position.set(x, y)
    scene.addChild(bub)
    bub.animate({
      duration: 1 + 3 * random(),
      onComplete: resolve
    })
    return promise
  }))

  await delay(1 + 3 * random())
  loop()
}()

// 潭中鱼可百许头
const fishes = Object.entries(Fish.Color).map(([k, v]) => {
  const fish = new Fish(v)
  fish.speed = (1 + random()) * 2
  fish.animationSpeed *= fish.speed
  fish.direction = random() * PI2
  fish.turnSpeed = random() - .8

  fish.position.set(random() * screen.width, random() * screen.height)

  return scene.addChild(fish)
})

// 荷叶
{
  // 左上
  let lotus = PIXI.Sprite.from('zero.lotus.leaf.6.png')
  lotus.zIndex = 3
  lotus.scale.set(.5)
  lotus.anchor.set(0)
  scene.addChild(lotus)

  // 右上
  lotus = PIXI.Sprite.from('zero.lotus.leaf.3.png')
  lotus.anchor.set(1, 0)
  lotus.zIndex = 3
  lotus.x = screen.width
  scene.addChild(lotus)

  // 正下
  lotus = PIXI.Sprite.from('zero.lotus.leaf.7.png')
  lotus.anchor.set(.5, 1)
  lotus.y = screen.height
  lotus.zIndex = 3
  lotus.x = screen.width / 2
  scene.addChild(lotus)
}

settings.widget === 2 ? widget.show({parent: scene}) : widget.init({parent: scene})
menu.init({parent: scene})
menu.on('tap', ({name, onComplete}) => {
  switch (name) {
    case 'info': {
      widget.toggle().then(done => done && onComplete())
      break
    }

    default: {
      onComplete()
    }
  }
})

const bound = screen.clone().pad(100)

ticker.add(() => {
  for (const fish of fishes) {
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
})
