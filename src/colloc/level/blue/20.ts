export default {
  start: {x: 400, y: 1800},
  end: {x: 400, y: 0},
  baffles: [
    {frame: 'pink.png', x: 0, y: 600, angle: -45},
    {frame: 'blue.png', x: 0, y: 1000, angle: -45, shadow: 45},
    {frame: 'blue.png', x: 0, y: 1400, angle: 45, shadow: 135},

    {frame: 'blue.png', x: 400, y: 600, angle: 45, shadow: 135},
    {frame: 'square.once.png', x: 400, y: 1000},
    {frame: 'pink.png', x: 400, y: 1400, angle: 45, shadow: 135},

    {frame: 'blue.png', x: 800, y: 600, angle: 45, shadow: 135},
    {frame: 'pink.png', x: 800, y: 1000, angle: -45},
    {frame: 'blue.png', x: 800, y: 1400, angle: -45, shadow: 45}
  ]
}