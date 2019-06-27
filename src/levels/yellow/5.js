export default {
  start: {x: 200, y: 2000},
  end: {x: 600, y: 0},
  baffles: [
    {frame: 'square.once.png', x: 0, y: 200},
    {frame: 'blue.png', x: 0, y: 600, angle: 45},
    {frame: 'pink.png', x: 0, y: 1000, angle: 45, shadow: 135},

    {frame: 'square.once.png', x: 200, y: 200},
    {frame: 'yellow.auto.png', x: 200, y: 600, angle: 45},
    {frame: 'yellow.auto.png', x: 200, y: 1200, angle: 45},

    {frame: 'green.png', x: 400, y: 1000, angle: 45, shadow: 135},
    {frame: 'blue.png', x: 400, y: 1600, angle: 45, shadow: 135},

    {frame: 'ring.png', x: 600, y: 600},
    {frame: 'square.png', x: 600, y: 800},
    {frame: 'ring.png', x: 600, y: 1200},
    {frame: 'pink.png', x: 600, y: 1600, angle: -45, shadow: 45},

    {frame: 'square.png', x: 800, y: 600},
    {frame: 'square.png', x: 800, y: 1200}
  ]
}