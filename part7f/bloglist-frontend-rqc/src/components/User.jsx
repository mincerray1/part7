import { useMatch } from 'react-router-dom'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import userService from '../services/users'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'

const User = () => {
  const queryClient = useQueryClient()
  const userMatch = useMatch('/users/:id')

  // const user = userMatch
  //   ? getUserById(userMatch.params.id)
  //   : null

  const userResult = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const users = queryClient.getQueryData(['users'])
      if (users) {
        return users.find(a => a.id === userMatch.params.id)
      } else {
        const result = await userService.getById(userMatch.params.id)
        return result
      }
    },
    refetchOnWindowFocus: false,
    retry: 1
  })

  if ( userResult.isError ) {
    return <div>user service not available due to problems in the server</div>
  }
  if ( userResult.isLoading ) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    )
  }

  const user = userResult.data
  if (!user) {
    return null
  }

  // if (!users) {
  //   return null
  // }

  // const getUserById = async (id) => {
  //   const result = await userService.getById(id)
  //   console.log('result', result)
  //   return result
  // }
  // const userById = (id) =>
  //   users.find(a => a.id === id)


  return (
    <div>
      <h4>{user.name}</h4>
      <b>added blogs</b>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></li>
        ))}
      </ul>
    </div>
  )
}

export default User