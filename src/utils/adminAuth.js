import Cookies from 'universal-cookie'

const cookies = new Cookies()

// Returns the token only if it exists, is readable, and hasn't expired
export const getValidToken = () => {
  const token = cookies.get('adminToken')
  if (!token) return null

  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      cookies.remove('adminToken', { path: '/' })
      return null
    }
    return token
  } catch {
    cookies.remove('adminToken', { path: '/' })
    return null
  }
}