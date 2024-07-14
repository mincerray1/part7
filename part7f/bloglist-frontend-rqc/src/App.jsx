import { useRef } from 'react'
import BlogList from './components/BlogList'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import UserList from './components/UserList'
import User from './components/User'
import Blog from './components/Blog'
import Notification from './components/Notification'

import { useAuthValue } from './context/AuthContext'
import LoginForm from './components/LoginForm'

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import Menu from './components/Menu'

import { Container } from '@mui/material'

const App = () => {
  const blogFormRef = useRef()
  const currentUser = useAuthValue()

  if (currentUser === null) {
    return LoginForm()
  }

  return (
    <Container>
      <Menu />
      <Notification />
      <Togglable buttonLabel="create new" cancelLabel="cancel" ref={blogFormRef}>
        <BlogForm />
      </Togglable>
      <br />
      <Routes>
        <Route path="/users" element={<UserList />}></Route>
        <Route path="/users/:id" element={<User />}></Route>
        <Route path="/blogs" element={<BlogList />}></Route>
        <Route path="/blogs/:id" element={<Blog />}></Route>
        <Route path="/" element={<BlogList />}></Route>
      </Routes>
    </Container>
  )
}

export default App
