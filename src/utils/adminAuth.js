
import Cookies from 'universal-cookie'

const cookies = new Cookies()

// Returns the token only if it exists and has not expired.
export const getValidToken = () => {
  const token = cookies.get('adminToken')

  if (typeof token !== 'string' || !token) {
    return null
  }

  try {
    const parts = token.split('.')

    if (parts.length !== 3 || !parts[1]) {
      cookies.remove('adminToken', { path: '/' })
      return null
    }

    const base64 = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const payload = JSON.parse(atob(base64))

    // Require a valid expiration time.
    if (
      typeof payload.exp !== 'number' ||
      !Number.isFinite(payload.exp) ||
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
