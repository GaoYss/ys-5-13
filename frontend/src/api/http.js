const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: '请求失败' }))
    const detail = errorData.detail
    let message = '请求失败'
    let detailObj = null

    if (typeof detail === 'string') {
      message = detail
    } else if (detail && typeof detail === 'object') {
      message = detail.message || '请求失败'
      detailObj = detail
    }

    const error = new Error(message)
    if (detailObj) {
      error.detail = detailObj
    }
    throw error
  }

  return response.json()
}

export const http = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) })
}
