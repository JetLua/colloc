import {stage, screen} from '~/core'
import {store} from '~/util'

import {menu, monitor} from '../module'

let scene: PIXI.Container

function init() {
  scene = new PIXI.Container()
  stage.addChild(scene)
  menu.show({parent: scene})
  menu.setPosition(screen.width / 2, screen.height / 2)
  menu.on('pointerdown', ({target}: IEvent) => {
    switch (target.name) {
      case 'blue': {
        monitor.emit('scene:go', 'selector')
        break
      }
    }
  })
}

export function show() {
  if (scene) return scene.visible = true
  init()
}

export function hide() {
  scene.visible = false
}
