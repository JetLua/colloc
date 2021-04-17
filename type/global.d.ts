declare module '*.frag'
declare module '*.vert'

declare const canvas: HTMLCanvasElement
declare const CDN: string
declare const CLOUD_ID: string

interface Window {
  interaction: Promise<wx.IRect>
}

interface IEvent {
  x: number
  y: number
  id: number
  type: string
  target: PIXI.Container
  currentTarget: PIXI.Container
}
