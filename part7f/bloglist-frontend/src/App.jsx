import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import { setNotification } from './reducers/notificationReducer'

import { initializeBlogs, createBlog, deleteBlog, addLike } from './reducers/blogReducer'
import { useSelector } from 'react-redux'
import { login, logout, initializeAuthenticatedUser } from './reducers/authenticatedUserReducer'
// import { createSelector } from '@reduxjs/toolkit'

const App = () => {
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAuthenticatedUser())
  }, [])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  const blogs = useSelector((state) => {
    if (state.blogs) {
      return [...state.blogs].sort((a, b) => b.likes - a.likes)
    }
    return state.blogs
  })
  const user = useSelector((state) => {
    return state.authenticatedUser
  })

  const handleLogin = (event) => {
    event.preventDefault()
    dispatch(login(event.target.username.value, event.target.password.value))
  }
  const handleLogout = (event) => {
    event.preventDefault()
    dispatch(logout())
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to application</h2>
      <Notification />
      <div>
        username
        <input
          id="username"
          type="text"
          name="username"
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          name="password"
        />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  )

  if (user === null) {
    return loginForm()
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
      dispatch(createBlog(blogObject))
    } catch (exception) {
      dispatch(setNotification(exception, 'error', 2))
    }
  }

  const handleRemoveBlog = async (blog) => {
    try {
      if (confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        dispatch(deleteBlog(blog.id))
        dispatch(setNotification('blog removed', 'success', 2))
      }
    } catch (exception) {
      dispatch(setNotification(exception, 'error', 2))
    }
  }

  const handleLike = async (blog) => {
    try {
      dispatch(addLike(blog))
      dispatch(setNotification(`blog ${blog.title} liked`, 'success', 2))
    } catch (exception) {
      console.log(exception)
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>{user.name} logged in</p>{' '}
      <form onSubmit={handleLogout}>
        <button id="logout" type="submit">
          logout
        </button>
      </form>
      <Togglable buttonLabel="new blog" cancelLabel="cancel" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          removeBlog={handleRemoveBlog}
          showRemove={blog.user && blog.user.username === user.username}
          handleLike={handleLike}
        />
      ))}
    </div>
  )
}

export default App
