declare module '*.frag'
declare module '*.vert'

declare const canvas: HTMLCanvasElement
declare const CDN: string
declare const CLOUD_ID: string

interface Window {
  _core: any
  _pixi: any
  interaction: Promise<wx.IRect>
}
