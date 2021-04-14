export default function<T>(): [Promise<T>, (v?: T) => void, (v?: Error) => void] {
  let reject: (v?: Error) => void
  let resolve: (v?: T) => void

  const promise = new Promise<T>((_resolve, _reject) => {
    reject = _reject
    resolve = _resolve
  })

  return [promise, resolve, reject]
}
