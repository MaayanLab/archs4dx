/////////////////////////////////////////////////////////////////////
// Generic module to fetch data 
// 1. Create an env var with base API URL
// 2. Token or API key could be stored in localStorage
/////////////////////////////////////////////////////////////////////

const baseURL = process.env.REACT_APP_BASE_API_URL
const INVALID_TOKEN_MESSAGE = 'Invalid token provided.'

class RequestError extends Error {
  constructor(status, statusText, data, ...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequestError)
    }

    this.name = 'RequestError'
    this.message = 'Request Error'
    this.status = status
    this.statusText = statusText
    this.data = data
  }
}

export const fetchWrapper = async (
  url,
  { method = 'GET', data, headers, ...rest }
) => {
  const options = {
    method,
    mode: 'cors',
    body: data,
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    ...rest,
  }
  if (options.headers['Content-Type'] === 'multipart/form-data') {
    delete options.headers['Content-Type']
  }
  const response = await fetch(url, options)
  const isJson = response.headers.get('Content-Type') === 'application/json'

  const parsed = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    throw new RequestError(response.status, response.statusText, parsed)
  }
  return parsed
}

export const fetchPublic = async (url, { data, ...rest } = {}) => {
  return await fetchWrapper(baseURL + url, {
    data: JSON.stringify(data),
    ...rest,
  })
}

export const fetchPrivate = async (url, { headers, data, ...rest } = {}) => {
  const token = localStorage.getItem('token')

  if (token === null) {
    throw new Error(
      'Invalid Token Error: fetchPrivate requires an access token to be set'
    )
  }
  const headersWithAuth = {
    Authorization: token,
    ...(headers || {}),
  }

  try {
    const response = await fetchWrapper(baseURL + url, {
      data: JSON.stringify(data),
      headers: headersWithAuth,
      ...rest,
    })
    return response
  } catch (e) {
    if (e instanceof RequestError && e.data.message === INVALID_TOKEN_MESSAGE) {
      console.warn('Invalid or expired token on fetchPrivate')
    }
    throw e
  }
}

export default fetchWrapper
