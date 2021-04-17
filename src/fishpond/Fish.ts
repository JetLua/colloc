enum Color {
  Red = 'red',
  Blue = 'blue',
  Yellow = 'yellow'
}

export default class extends PIXI.AnimatedSprite {
  static Color = Color

  speed: number
  direction: number
  turnSpeed: number

  constructor(color: Color) {
    super(Array.from({length: 3}, (_, i) => PIXI.Texture.from(`zero.fish.${color}.${i + 1}.png`)))
    this.animationSpeed = .02
    this.play()
  }
}
