export default {
  start: {x: 400, y: 2000},
  end: {x: 600, y: 0},
  baffles: [
    {frame: 'gear.png', x: 0, y: 400, angle: 45},
    {frame: 'arrow.down.png', x: 0, y: 1000},
    {frame: 'gear.png', x: 0, y: 1600, angle: -45},

    {frame: 'blue.png', x: 200, y: 600, angle: -45, shadow: 45},
    {frame: 'ring.png', x: 200, y: 1000},
    {frame: 'blue.png', x: 200, y: 1400, angle: 45, shadow: 135},

    {frame: 'square.png', x: 400, y: 1000},
    {frame: 'green.png', x: 400, y: 1400, angle: 135, shadow: 225},

    {frame: 'square.once.png', x: 600, y: 400},
    {frame: 'pink.png', x: 600, y: 600, angle: -45},
    {frame: 'ring.png', x: 600, y: 1000},
    {frame: 'pink.png', x: 600, y: 1400, angle: 45},
    {frame: 'square.once.png', x: 600, y: 1600},

    {frame: 'triangle.png', x: 800, y: 400, angle: 90},
    {frame: 'arrow.up.png', x: 800, y: 1000},
    {frame: 'triangle.png', x: 800, y: 1600, angle: 180}
  ]
}