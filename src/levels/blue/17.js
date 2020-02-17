export default {
  start: {x: 400, y: 1800},
  end: {x: 400, y: 0},
  baffles: [
    {frame: 'square.png', x: 0, y: 400},
    {frame: 'pink.png', x: 0, y: 800, angle: 45},
    {frame: 'pink.png', x: 0, y: 1000, angle: -45},

    {frame: 'pink.png', x: 200, y: 600, angle: 45},
    {frame: 'blue.png', x: 200, y: 800, angle: -45, shadow: 45},
    {frame: 'blue.png', x: 200, y: 1200, angle: -45},

    {frame: 'pink.png', x: 400, y: 400, angle: -45},
    {frame: 'green.png', x: 400, y: 1000, angle: 135},
    {frame: 'green.png', x: 400, y: 1400, angle: 135, shadow: 225},

    {frame: 'pink.png', x: 600, y: 400, angle: -45},
    {frame: 'pink.png', x: 600, y: 600, angle: -45, shadow: 45},
    {frame: 'blue.png', x: 600, y: 800, angle: 45},
    {frame: 'blue.png', x: 600, y: 1200, angle: 45},

    {frame: 'pink.png', x: 800, y: 800, angle: -45},
    {frame: 'pink.png', x: 800, y: 1000, angle: 45},
    {frame: 'square.png', x: 800, y: 1400}
  ]
}