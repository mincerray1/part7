import { useSetNotification } from '../context/NotificationContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import blogService from '../services/blogs'
import { Typography, Button } from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

const BlogForm = () => {
  const setNotification = useSetNotification()
  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newObject) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newObject))
      setNotification(`blog ${newObject.title} added`, 'success', 2)
    },
    onError: (err) => {
      setNotification(err.response.data.error, 'error', 2)
    }
  })

  const addBlog = (event) => {
    event.preventDefault()
    const newObject = {
      title: event.target.title.value,
      author: event.target.author.value,
      url: event.target.url.value,
    }
    newBlogMutation.mutate(newObject)
    event.target.title.value = ''
    event.target.author.value = ''
    event.target.url.value = ''
  }

  return (
    <div>
      <Typography variant="h5">Create a new blog</Typography>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={addBlog}
      >
        <TextField id="title" label="Title" name="title" variant="standard" size="small" />
        <TextField id="author" label="Author" name="author" variant="standard" size="small" />
        <TextField id="url" label="URL" name="url" variant="standard" size="small" />
        <Button variant="contained" type="submit" size="small">Create</Button>
      </Box>
    </div>
  )
}

export default BlogForm
