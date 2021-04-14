declare module '*.frag'
declare module '*.vert'

declare const canvas: HTMLCanvasElement
declare const CDN: string
declare const CLOUD_ID: string

interface Window {
  _core: any
  _pixi: any
}

interface ILevelData {
  col: number
  row: number
  layout: number[]
  role?: {x: number, y: number}
  tint?: number
  boxes?: {x: number, y: number}[]
  subs?: this[]
  x?: number
  y?: number
  frames: {
    x: number
    y: number
    role?: boolean
  }[]
}
