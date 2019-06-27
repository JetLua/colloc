export default {
  start: {x: 600, y: 2000},
  end: {x: 200, y: 0},
  baffles: [
    {frame: 'green.png', x: 0, y: 400, angle: 45},
    {frame: 'blue.png', x: 0, y: 600, angle: 45},
    {frame: 'triangle.png', x: 0, y: 1200, angle: -90},
    {frame: 'triangle.png', x: 0, y: 1600},

    {frame: 'green.png', x: 200, y: 400, angle: 135, shadow: 225},
    {frame: 'green.png', x: 200, y: 600, angle: 135, shadow: 225},
    {frame: 'square.once.png', x: 200, y: 1200},

    {frame: 'pink.png', x: 400, y: 1000, angle: -45, shadow: 45},
    {frame: 'pink.png', x: 400, y: 1200, angle: -45},

    {frame: 'square.png', x: 600, y: 600},
    {frame: 'pink.png', x: 600, y: 1000, angle: 45, shadow: 135},
    {frame: 'green.png', x: 600, y: 1200, angle: 45, shadow: 225},
    {frame: 'green.png', x: 600, y: 1600, angle: 45, shadow: 225},

    {frame: 'square.once.png', x: 800, y: 1200},
    {frame: 'green.png', x: 800, y: 1600, angle: 135}
  ]
}