
import Cookies from 'universal-cookie'

const cookies = new Cookies()

export const getValidToken = () => {
  const token = cookies.get('adminToken')

  if (!token || typeof token !== 'string') return null

  try {
    const parts = token.split('.')

    if (parts.length !== 3 || !parts[1]) {
      cookies.remove('adminToken', { path: '/' })
      return null
    }

    const base64 = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const paddedBase64 = base64.padEnd(
      Math.ceil(base64.length / 4) * 4,
      '='
    )

    const payload = JSON.parse(atob(paddedBase64))

    if (
      !payload.exp ||
      typeof payload.exp !== 'number' ||
      payload.exp * 1000 <= Date.now()
    ) {
      cookies.remove('adminToken', { path: '/' })
      return null
    }

    return token
  } catch {
    cookies.remove('adminToken', { path: '/' })
    return null
  }
}
