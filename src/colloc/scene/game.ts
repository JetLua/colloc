import {stage} from '~/core'


export function show() {
  const s = PIXI.Sprite.from('ui.circle.blue.png')
  stage.addChild(s)
}

export function hide() {

}
