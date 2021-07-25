export default {
  start: {x: 800, y: 1400},
  end: {x: 0, y: 1400},
  baffles: [
    {frame: 'pink.png', x: 0, y: 200, angle: 45},
    {frame: 'pink.png', x: 0, y: 400, angle: -45},
    {frame: 'blue.png', x: 0, y: 600, angle: 45},

    {frame: 'pink.png', x: 200, y: 0, angle: 45},
    {frame: 'pink.png', x: 200, y: 200, angle: -45},
    {frame: 'pink.png', x: 200, y: 400, angle: 45},
    {frame: 'blue.png', x: 200, y: 600, angle: -45, shadow: 45},

    {frame: 'pink.png', x: 600, y: 0, angle: -45},
    {frame: 'pink.png', x: 600, y: 200, angle: 45},
    {frame: 'pink.png', x: 600, y: 400, angle: -45},
    {frame: 'blue.png', x: 600, y: 600, angle: 45, shadow: 135},

    {frame: 'pink.png', x: 800, y: 200, angle: -45},
    {frame: 'pink.png', x: 800, y: 400, angle: 45},
    {frame: 'blue.png', x: 800, y: 600, angle: -45}
  ]
}