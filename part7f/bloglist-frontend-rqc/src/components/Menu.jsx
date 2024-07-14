// import { Link } from 'react-router-dom'
import { forwardRef } from 'react'
import { useAuthValue, useLogout } from '../context/AuthContext'

import PropTypes from 'prop-types'
import { Link as RouterLink, MemoryRouter } from 'react-router-dom'
import { StaticRouter } from 'react-router-dom/server'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import { Box } from '@mui/material'


function Router(props) {
  const { children } = props
  if (typeof window === 'undefined') {
    return <StaticRouter location="/">{children}</StaticRouter>
  }

  return <MemoryRouter>{children}</MemoryRouter>
}

Router.propTypes = {
  children: PropTypes.node,
}

const Menu = () => {
  const currentUser = useAuthValue()
  const logout = useLogout()

  const handleLogout = (event) => {
    event.preventDefault()
    logout()
  }

  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <div>
        <Button component={RouterLink} to="/">
          Blogs
        </Button>
        <Button component={RouterLink} to="/users">
          Users
        </Button>
        <Button component={RouterLink} onClick={handleLogout}>
          Logout ({currentUser.username})
        </Button>
      </div>
    </div>
  )
}

export default Menu