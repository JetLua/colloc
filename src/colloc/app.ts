import {monitor} from './module'
import {preload, game, entry, selector} from './scene'


await preload()


const stack: {cursor: IScene, args: any[]}[] = []

monitor.on('scene:go', (name: string, ...args: any[]) => {
  const cursor: IScene = {game, entry, selector}[name]
  stack[stack.length - 1]?.cursor.hide()
  cursor.show(...args)
  stack.push({cursor, args})
}).on('scene:back', () => {
  if (stack.length < 2) return monitor.emit('scene:go', 'entry')
  stack.pop().cursor.hide()
  const {cursor, args} = stack[stack.length - 1]
  cursor.show(...args)
})

monitor.emit('scene:go', 'entry')
