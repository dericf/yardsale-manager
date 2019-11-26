import { BASE_URL } from './constants'

const jwtDecode = require('jwt-decode');


export const auth = {
  isAuthenticated: false,
  loading: false,
  reAuthenticateRequired: false,
  user: {
    email: "",
    role: ""
  },
  login: (auth, setAuth) => {
    console.log('Login User Here')
    return
  },
  logout: (auth, setAuth) => {
    console.log('Logout User Here')
    localStorage.removeItem('accessToken')
    setAuth({ ...auth, isAuthenticated: false, loading: false })
    window.location.assign('/')
    return
  }
}