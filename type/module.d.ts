import * as PIXI from 'pixi.js'

declare global {
  interface IEvent {
    x: number
    y: number
    id: number
    target: PIXI.Container
    currentTarget: PIXI.Container
  }
}
