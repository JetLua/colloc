import {stage, screen} from '~/core'
import {monitor} from '../../module'
import * as menu from './menu'

let scene: PIXI.Container

function init() {
  scene = new PIXI.Container()
  stage.addChild(scene)
  const _menu = menu.show()
  _menu.position.set(screen.width / 2, screen.height / 2)
  _menu.on('pointerup', ({target}: IEvent) => {
    switch (target.name) {
      case 'blue': {
        monitor.emit('scene:go', 'selector',  0)
        break
      }

      case 'pink': {
        monitor.emit('scene:go', 'selector',  1)
        break
      }

      case 'yellow': {
        monitor.emit('scene:go', 'selector',  2)
        break
      }

      case 'setting': {
        monitor.emit('scene:go', 'setting')
        break
      }
    }
  })
  scene.addChild(_menu)
}

export function show() {
  if (!scene) init()
  scene.visible = true
  menu.update()
}

export function hide() {
  scene.visible = false
}
