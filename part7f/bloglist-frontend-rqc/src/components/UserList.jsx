
import { useAuthValue } from '../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'
import { Link } from 'react-router-dom'

import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'

const UserList = () => {
  const usersResult = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false
  })
  const users = usersResult.data

  if ( usersResult.isError ) {
    return <div>user service not available due to problems in the server</div>
  }
  if ( usersResult.isLoading ) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    )
  }

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <td></td>
            <td><b>blogs created</b></td>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.username}>
              <td><Link to={`/users/${user.id}`}>{user.username}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList