export default {
  start: {x: 400, y: 2000},
  end: {x: 400, y: 0},
  baffles: [
    {frame: 'blue.png', x: 0, y: 600, angle: 45},
    {frame: 'gear.png', x: 0, y: 800, angle: 45},
    {frame: 'pink.png', x: 0, y: 1200, angle: 45},
    {frame: 'blue.png', x: 0, y: 1600, angle: 45, shadow: 135},

    {frame: 'ring.png', x: 400, y: 400},
    {frame: 'blue.png', x: 400, y: 600, angle: 45},
    {frame: 'pink.png', x: 400, y: 800, angle: 45},
    {frame: 'pink.png', x: 400, y: 1200, angle: 45},

    {frame: 'ring.png', x: 800, y: 400},
    {frame: 'square.once.png', x: 800, y: 800},
    {frame: 'square.once.png', x: 800, y: 1200},
    {frame: 'pink.png', x: 800, y: 1600, angle: -45, shadow: 45},
    {frame: 'square.once.png', x: 800, y: 1800}
  ]
}