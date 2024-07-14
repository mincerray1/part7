import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { setNotification } from '../reducers/notificationReducer'
import blogService from '../services/blogs'
import { useAuthValue } from '../context/AuthContext'
import { Link as RouterLink } from 'react-router-dom'

import { Link, Typography } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'

const BlogList = () => {
  const user = useAuthValue()
  const queryClient = useQueryClient()

  const blogsResult = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      console.log('run blogs getAll')
      const blogs = await blogService.getAll()
      return [...blogs].sort((a, b) => b.likes - a.likes)
    },
    refetchOnWindowFocus: false,
    retry: 1
  })
  const blogs = blogsResult.data
  // const blogs = queryClient.getQueryData(['blogs'])

  const removeBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (id) => {
      const blogs = queryClient.getQueryData(['blogs'])
      const newBlogs = blogs.filter(blog => blog.id !== id)
      queryClient.setQueryData(['blogs'], newBlogs)
    },
  })

  const handleRemoveBlog = async (blog) => {
    try {
      if (confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        removeBlogMutation.mutate(blog.id)
        setNotification('blog removed', 'success', 2)
      }
    } catch (exception) {
      setNotification(exception.response.data.error, 'error', 2)
    }
  }

  if ( blogsResult.isError ) {
    return <div>Blog service not available due to problems in the server</div>
  }

  if ( blogsResult.isLoading ) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    )
  }

  return (
    <div>
      <Typography variant="h5">Blogs</Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>URL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Link component={RouterLink} to={`/blogs/${row.id}`}>{row.title}</Link> <ThumbUpIcon color="primary" fontSize="small" />{row.likes}
                </TableCell>
                <TableCell>{row.author}</TableCell>
                <TableCell>{row.url}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BlogList