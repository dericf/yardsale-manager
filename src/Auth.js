import { BASE_URL } from './constants'

const jwtDecode = require('jwt-decode');


export const auth = {
  isAuthenticated: false,
  loading: false,
  reAuthenticateRequired: false,
  isLoggedIn: false,
  user: null,
  login: (auth, setAuth) => {
    // console.log('Login User Here')
    return
  },
  logout: (auth, setAuth, history) => {
    // console.log('Logout User Here')
    localStorage.removeItem('accessToken')
    setAuth({ ...auth, isAuthenticated: false, loading: false, user: null })
    history.push('/login')
    return
  }
}