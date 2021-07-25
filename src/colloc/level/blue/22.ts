export default {
  start: {x: 0, y: 1800},
  end: {x: 0, y: 0},
  baffles: [
    {frame: 'square.png', x: 0, y: 400},
    {frame: 'square.once.png', x: 0, y: 600},
    {frame: 'green.png', x: 0, y: 1000, angle: 45},
    {frame: 'green.png', x: 0, y: 1400, angle: 135, shadow: 315},

    {frame: 'square.png', x: 200, y: 400},
    {frame: 'square.once.png', x: 200, y: 600},
    {frame: 'pink.png', x: 200, y: 1000, angle: -45},
    {frame: 'square.once.png', x: 200, y: 1200},
    {frame: 'blue.png', x: 200, y: 1400, angle: 45},


    {frame: 'green.png', x: 600, y: 0, angle: 45, shadow: 135},
    {frame: 'green.png', x: 600, y: 400, angle: 135, shadow: 225},
    {frame: 'pink.png', x: 600, y: 1000, angle: 45},
    {frame: 'pink.png', x: 600, y: 1400, angle: -45},

    {frame: 'pink.png', x: 800, y: 0, angle: -45},
    {frame: 'blue.png', x: 800, y: 400, angle: 45},
    {frame: 'blue.png', x: 800, y: 1000, angle: -45},
    {frame: 'blue.png', x: 800, y: 1400, angle: 45}
  ]
}