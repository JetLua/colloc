import {error, ok} from '~/util'

const fs = wx.getFileSystemManager()

export const root = wx.env.USER_DATA_PATH

export function access(path: string) {
  return new Promise<[boolean, Error]>((resolve) => {
    fs.access({
      path: `${root}/${path}`,
      success: () => resolve(ok(true)),
      fail: ({errMsg}) => resolve(error(errMsg))
    })
  })
}

export function save(src: string, dst: string) {
  return new Promise<[string, Error]>((resolve) => {
    fs.saveFile({
      tempFilePath: src,
      filePath: `${root}/${dst}`,
      success: ({savedFilePath}) => resolve(ok(savedFilePath)),
      fail: ({errMsg}) => resolve(error(errMsg))
    })
  })
}

export function mkdir(path: string, recursive = true) {
  return new Promise<[boolean, Error]>((resolve) => {
    fs.mkdir({
      dirPath: `${root}/${path}`,
      recursive,
      success: () => resolve(ok(true)),
      fail: ({errMsg}) => resolve(error(errMsg))
    })
  })
}

export function read(opts: {
  path: string
  encoding?: 'ascii' | 'base64' | 'binary' | 'hex' | 'utf-8' | 'utf8'
  position?: number
  length?: number
}) {
  return new Promise<[string | ArrayBuffer, Error]>((resolve) => {
    fs.readFile({
      filePath: `${root}/${opts.path}`,
      encoding: opts.encoding,
      position: opts.position,
      length: opts.length,
      success: ({data}) => resolve(ok(data)),
      fail: ({errMsg}) => resolve(error(errMsg))
    })
  })
}
