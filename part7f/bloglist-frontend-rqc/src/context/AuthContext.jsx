import { createContext, useReducer, useContext, useEffect } from 'react'
import blogService from '../services/blogs'
import userService from '../services/users'
import loginService from '../services/login'

// {message, auth_type}
const authReducer = (state, action) => {
  switch (action.type) {
  case 'LOGIN':
    return action.payload
  case 'LOGOUT':
    return null
  default:
    return state
  }
}

const AuthContext = createContext()

export const AuthContextProvider = (props) => {
  //{ message: null, authType: 'success' })
  const [user, dispatch] = useReducer(authReducer, null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch({ type: 'LOGIN', payload: user })

      blogService.setToken(user.token)
      userService.setToken(user.token)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuthValue = () => {
  const { user } = useContext(AuthContext)
  return user
}

export const useAuthDispatch = () => {
  const { dispatch } = useContext(AuthContext)
  return dispatch
}

export const useLogin = () => {
  const dispatch = useAuthDispatch()
  const login = async (username, password) => {
    const user = await loginService.login({
      username,
      password,
    })

    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    blogService.setToken(user.token)
    userService.setToken(user.token)
    dispatch({ type: 'LOGIN', payload: user })
  }

  return login
}

export const useLogout = () => {
  const dispatch = useAuthDispatch()
  const logout = async (username, password) => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken('')
    dispatch({ type: 'LOGOUT' })
  }

  return logout
}

export default AuthContext