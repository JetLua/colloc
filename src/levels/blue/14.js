export default {
  start: {x: 400, y: 2000},
  end: {x: 400, y: 0},
  baffles: [
    {frame: 'blue.png', x: 0, y: 600, angle: 45},
    {frame: 'pink.png', x: 0, y: 1200, angle: -45},
    {frame: 'blue.png', x: 0, y: 1400, angle: 45},

    {frame: 'pink.png', x: 400, y: 600, angle: 45},
    {frame: 'green.png', x: 400, y: 800, angle: 135},
    {frame: 'pink.png', x: 400, y: 1200, angle: -45},
    {frame: 'green.png', x: 400, y: 1400, angle: 45, shadow: 225},

    {frame: 'pink.png', x: 800, y: 600, angle: 45},
    {frame: 'blue.png', x: 800, y: 800, angle: -45},
    {frame: 'blue.png', x: 800, y: 1400, angle: 45}
  ]
}