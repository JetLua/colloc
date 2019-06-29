export default {
  start: {x: 800, y: 2000},
  end: {x: 800, y: 0},
  baffles: [
    {frame: 'triangle.png', x: 0, y: 600},
    {frame: 'triangle.png', x: 0, y: 1000, angle: -90},
    {frame: 'blue.png', x: 0, y: 1400, angle: 45},
    {frame: 'square.once.png', x: 0, y: 1800},

    {frame: 'triangle.png', x: 200, y: 600},
    {frame: 'blue.png', x: 200, y: 1000, angle: -45, shadow: 45},
    {frame: 'pink.png', x: 200, y: 1400, angle: -45},
    {frame: 'arrow.up.png', x: 200, y: 1800},

    {frame: 'triangle.png', x: 400, y: 400},
    {frame: 'pink.png', x: 400, y: 600, angle: 45, shadow: 135},
    {frame: 'blue.png', x: 400, y: 800, angle: -45, shadow: 45},
    {frame: 'green.png', x: 400, y: 1400, angle: 45, shadow: 135},
    {frame: 'arrow.down.png', x: 400, y: 1800},

    {frame: 'triangle.png', x: 600, y: 400, angle: 90},
    {frame: 'pink.png', x: 600, y: 600, angle: -45},
    {frame: 'blue.png', x: 600, y: 800, angle: 45, shadow: 135},
    {frame: 'pink.png', x: 600, y: 1400, angle: -45},
    {frame: 'square.once.png', x: 600, y: 1800},

    {frame: 'gear.png', x: 800, y: 600, angle: -45},
    {frame: 'pink.png', x: 800, y: 1000, angle: 45},
    {frame: 'green.png', x: 800, y: 1400, angle: 45, shadow: 135}
  ]
}