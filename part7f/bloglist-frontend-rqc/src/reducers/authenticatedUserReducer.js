import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'

const authenticatedUserSlice = createSlice({
  name: 'authenticatedUser',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    }
  },
})

export const login = (username, password) => {
  console.log('setAuthenticatedUser')
  return async dispatch => {
    const user = await loginService.login({
      username,
      password,
    })

    console.log('handleLogin')
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    blogService.setToken(user.token)

    dispatch(setUser(user))
  }
}

export const logout = () => {
  return async dispatch => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken('')

    dispatch(setUser(null))
  }
}

export const initializeAuthenticatedUser = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))

      blogService.setToken(user.token)
    }
  }
}

export const { setUser } =
  authenticatedUserSlice.actions
export default authenticatedUserSlice.reducer
