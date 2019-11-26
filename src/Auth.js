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

export const getJWT = () => {
  let token = localStorage.getItem('accessToken')
  if (!token) {
    console.log('NO TOKEN!')
    return null
  } else {
    let jwt = jwtDecode(token)
    console.log('DECODED TOKEN: ', jwt)
    if (typeof jwt.exp === 'undefined') {
      console.log('ERROR! TOKEN NEVER EXPIRES! ')
      return null
    }
    //
    // Check if token is expired
    //
    let current_time = Date.now().valueOf() / 1000;
    if (jwt.exp < current_time) {
      // Expired
      console.log('TOKEN IS EXPIRED!')
      refreshAccessToken()
    }
  }
}