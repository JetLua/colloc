import {loader} from '~/core'
import {createPromise} from '~/util'

export default function() {
  const [promise, resolve] = createPromise()

  loader
    .reset()
    .add('colloc/static/texture/ui.json')
    .add('colloc/static/texture/item.json')
    .load(resolve)

  return promise
}
