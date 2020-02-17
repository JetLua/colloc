export default {
  start: {x: 600, y: 2000},
  end: {x: 600, y: 0},
  baffles: [
    {frame: 'triangle.png', x: 0, y: 200},
    {frame: 'blue.png', x: 0, y: 400, angle: -45},
    {frame: 'arrow.right.png', x: 0, y: 1400},
    {frame: 'blue.png', x: 0, y: 1600, angle: 45},
    {frame: 'triangle.png', x: 0, y: 1800, angle: -90},

    {frame: 'pink.png', x: 200, y: 400, angle: 45},
    {frame: 'pink.png', x: 200, y: 600, angle: -45, shadow: 45},
    {frame: 'arrow.right.png', x: 200, y: 1200},
    {frame: 'green.png', x: 200, y: 1600, angle: 135, shadow: 315},

    {frame: 'square.once.png', x: 400, y: 1000},

    {frame: 'pink.png', x: 600, y: 600, angle: 45, shadow: 135},
    {frame: 'arrow.left.png', x: 600, y: 800},
    {frame: 'green.png', x: 600, y: 1600, angle: 45, shadow: 225},

    {frame: 'triangle.png', x: 800, y: 200, angle: 90},
    {frame: 'blue.png', x: 800, y: 400, angle: 45},
    {frame: 'arrow.left.png', x: 800, y: 600},
    {frame: 'blue.png', x: 800, y: 1600, angle: -45},
    {frame: 'triangle.png', x: 800, y: 1800, angle: -180}
  ]
}