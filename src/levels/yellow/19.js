export default {
  start: {x: 400, y: 2000},
  end: {x: 600, y: 0},
  baffles: [
    {frame: 'triangle.png', x: 0, y: 200},
    {frame: 'arrow.up.png', x: 0, y: 800},
    {frame: 'pink.png', x: 0, y: 1400, angle: -45},
    {frame: 'blue.png', x: 0, y: 1800, angle: -45},

    {frame: 'blue.png', x: 400, y: 600, angle: -45, shadow: 45},
    {frame: 'ring.png', x: 400, y: 800},
    {frame: 'ring.png', x: 400, y: 1200},
    {frame: 'green.png', x: 400, y: 1400, angle: -45, shadow: 225},

    {frame: 'yellow.auto.png', x: 600, y: 400, angle: -45},
    {frame: 'green.png', x: 600, y: 1800, angle: 135, shadow: 225},

    {frame: 'triangle.png', x: 800, y: 200, angle: 90},
    {frame: 'blue.png', x: 800, y: 600, angle: -45},
    {frame: 'blue.png', x: 800, y: 1200, angle: -45, shadow: 45},
    {frame: 'arrow.down.png', x: 800, y: 1400}
  ]
}