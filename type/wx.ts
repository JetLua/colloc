declare module wx {
  module cloud {
    function downloadFile(opts: Callback<{
      fileID: string
      config?: {
        env: string
      }
      success: (opts: {
        tempFilePath: string
      }) => void
      fail: (opts: {
        errCode: number
        errMsg: string
      }) => void
    }>): void

    function init(opts: {
      env: string
      traceUser?: boolean
    }): void
  }

  module env {
    const USER_DATA_PATH: string
  }

  interface Touch {
    identifier: number
    pageX: number
    pageY: number
    clientX: number
    clientY: number
    force: number
  }

  function loadSubpackage(opts: Callback<{
    name: string
  }>): void

  function offTouchMove(fn: Function): void
  function onTouchMove(opts: (opts: {
    touches: Touch[]
    changedTouches: Touch[]
    timeStamp: number
  }) => void): void

  function offTouchStart(fn: Function): void
  function onTouchStart(opts: (opts: {
    touches: Touch[]
    changedTouches: Touch[]
    timeStamp: number
  }) => void): void

  function offTouchEnd(fn: Function): void
  function onTouchEnd(opts: (opts: {
    touches: Touch[]
    changedTouches: Touch[]
    timeStamp: number
  }) => void): void

  function offTouchCancel(fn: Function): void
  function onTouchCancel(opts: (opts: {
    touches: Touch[]
    changedTouches: Touch[]
    timeStamp: number
  }) => void): void

  function hideLoading(): void

  function showLoading(opts: {
    title: string
    mask?: boolean
  }): void

  function showToast(opts: {
    title: string
    icon?: 'success' | 'error' | 'loading' | 'none'
    duration?: number
    mask?: boolean
  }): void

  function hideToast(): void

  function setEnableDebug(opts: Callback<{
    enableDebug: boolean
  }>): void

  function getFileSystemManager(): FileSystemManager

  interface FileSystemManager {
    access: (opts: Callback<{
      path: string
      fail?: (otps: {errMsg: string}) => void
    }>) => void

    saveFile: (opts: Callback<{
      tempFilePath: string
      filePath?: string
      success?: (opts: {
        savedFilePath: string
      }) => void
      fail?: (opts: {
        errMsg: string
      }) => void
    }>) => void

    mkdir: (opts: Callback<{
      dirPath: string
      recursive?: boolean,
      fail?: (opts: {errMsg: string}) => void
    }>) => void

    readFile: (opts: Callback<{
      filePath: string
      encoding?: 'ascii' | 'base64' | 'binary' | 'hex' | 'utf-8' | 'utf8'
      position?: number
      length?: number
      success?: (opts: {data: string | ArrayBuffer}) => void
      fail?: (opts: {errMsg: string}) => void
    }>) => void
  }

  /** 监听用户点击菜单「收藏」按钮时触发的事件（安卓7.0.15起支持，iOS 暂不支持 */
  function onAddToFavorites(fn: () => {
    title: string
    query: string
    imageUrl: string
    disableForward: boolean
  }): void

  /** 获取系统信息 */
  function getSystemInfoSync(): {
    windowWidth: number
    windowHeight: number
    pixelRatio: number
  }

  type Callback<T>  = T & Omit<Partial<{
    fail: (...args: any[]) => void
    success: (...args: any[]) => void
    complete: () => void
  }>, keyof T>
}
