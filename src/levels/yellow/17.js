export default {
  start: {x: 200, y: 2000},
  end: {x: 400, y: 0},
  baffles: [
    {frame: 'triangle.png', x: 0, y: 200},
    {frame: 'green.png', x: 0, y: 800, angle: 135},
    {frame: 'triangle.png', x: 0, y: 1600, angle: -90},

    {frame: 'square.once.png', x: 200, y: 600},
    {frame: 'pink.png', x: 200, y: 800, angle: 45},
    {frame: 'blue.png', x: 200, y: 1000, angle: -45},
    {frame: 'blue.png', x: 200, y: 1200, angle: 45},
    {frame: 'blue.png', x: 200, y: 1400, angle: -45},
    {frame: 'pink.png', x: 200, y: 1600, angle: 45},

    {frame: 'pink.png', x: 400, y: 800, angle: -45, shadow: 45},
    {frame: 'pink.png', x: 400, y: 1000, angle: 45, shadow: 135},
    {frame: 'pink.png', x: 400, y: 1200, angle: -45},
    {frame: 'square.once.png', x: 400, y: 1400},

    {frame: 'ring.png', x: 600, y: 600},
    {frame: 'blue.png', x: 600, y: 1000, angle: -45, shadow: 45},
    {frame: 'pink.png', x: 600, y: 1200, angle: 45},
    {frame: 'ring.png', x: 600, y: 1600},

    {frame: 'arrow.left.png', x: 800, y: 200},
    {frame: 'blue.png', x: 800, y: 600, angle: 45, shadow: 135},
    {frame: 'blue.png', x: 800, y: 1000, angle: 45},
    {frame: 'square.once.png', x: 800, y: 1600}
  ]
}