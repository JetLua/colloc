export default function(url, opt = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const {
      data,
      param,
      header,
      dataType,
      responseType,
      method = 'GET',
    } = opt

    if (header) for (const key in header) xhr.setRequestHeader(key, header[key])

    dataType && (xhr.dataType = dataType)
    responseType && (xhr.responseType = responseType)

    xhr.open(method, buildUrl(url, param))
    xhr.send(format(data))

    xhr.addEventListener('load', () => {
      resolve(xhr)
    })

    xhr.addEventListener('error', () => {
      reject(xhr)
    })
  })
}

function format(data) {
  return data && isObject(data) ? JSON.stringify(data) : data
}

function buildUrl(url, param) {
  if (!param) return url
  return `${url}?${Object.entries(param).map(item => item.join('=')).join('&')}`
}

function isObject(o) {
  return Object.prototype.toString.call(o).includes('Object')
}