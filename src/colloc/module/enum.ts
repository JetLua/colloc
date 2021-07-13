import {screen} from '~/core'

/** 设计尺寸 */
export enum Design {
  Width = 750,
  Height = 1334,
  Scale = Math.min(screen.width / 750, screen.height  / 1334)
}

export enum Color {
  Blue = 0x41a8f5,
  Pink = 0xf75897,
  Yellow = 0xfad388
}
