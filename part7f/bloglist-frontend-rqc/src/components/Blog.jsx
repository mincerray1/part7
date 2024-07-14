import { useMatch } from 'react-router-dom'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useSetNotification } from '../context/NotificationContext'
import { useNavigate } from 'react-router-dom'
import { useAuthValue } from '../context/AuthContext'

import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'

const Blog = () => {
  const queryClient = useQueryClient()
  const blogMatch = useMatch('/blogs/:id')
  const setNotification = useSetNotification()
  const navigate = useNavigate()
  const currentUser = useAuthValue()

  const blogResult = useQuery({
    queryKey: ['blog'],
    queryFn: async () => {
      console.log('run blog')
      const blogs = queryClient.getQueryData(['blogs'])
      if (blogs) {
        return blogs.find(a => a.id === blogMatch.params.id)
      } else {
        const result = await blogService.getById(blogMatch.params.id)
        return result
        // return null
      }
    },
    // refetchOnWindowFocus: false,
    // retry: 1
  })

  const likeBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (updatedBlog) => {
      const currentBlog = queryClient.getQueryData(['blog'])
      queryClient.setQueryData(['blog'], { ...currentBlog, likes: updatedBlog.likes })
      // queryClient.invalidateQueries({ queryKey: ['blog'] }, { refetchInactive: true }) //refresh likes
      // console.log('invalidateQueries')
    },
  })

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
        navigate('/blogs')
      }
    } catch (exception) {
      setNotification(exception.response.data.error, 'error', 2)
    }
  }

  const handleLike = async (blog) => {
    try {
      const updatedObject = { ...blog, likes: blog.likes + 1 }
      likeBlogMutation.mutate(updatedObject)
      setNotification(`blog ${blog.title} liked`, 'success', 2)
    } catch (exception) {
      setNotification(exception.response.data.error, 'error', 2)
    }
  }

  const commentBlogMutation = useMutation({
    mutationFn: (param) => {
      return blogService.addComment(param.blog_id, param.comment)
    },
    onSuccess: (updatedBlog) => {
      console.log('comment success')
      const currentBlog = queryClient.getQueryData(['blog'])
      console.log('updatedBlog', updatedBlog)
      queryClient.setQueryData(['blog'], { ...currentBlog, comments: updatedBlog.comments })
      // queryClient.invalidateQueries({ queryKey: ['blog'] }, { refetchInactive: true }) //refresh likes
      // console.log('invalidateQueries')
    },
  })

  const handleComment = async (event) => {
    event.preventDefault()
    try {
      const param = {
        blog_id: blog.id,
        comment: { comment: event.target.comment.value }
      }
      commentBlogMutation.mutate(param)
      setNotification(`comment '${param.comment.comment}' added`, 'success', 2)
      event.target.comment.value = ''
    } catch (exception) {
      setNotification(exception.response.data.error, 'error', 2)
    }
  }

  if ( blogResult.isError ) {
    return <div>blog service not available due to problems in the server</div>
  }
  if ( blogResult.isLoading ) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    )
  }

  const blog = blogResult.data
  if (!blog) {
    return null
  }

  return (
    <div>
      <h3>{blog.title} by {blog.author}</h3>
      <div>{blog.url}</div>
      <div><ThumbUpIcon color="primary" fontSize="small" /> {blog.likes} <button onClick={() => handleLike(blog)}>like</button></div>
      <div>
        {
          blog.user
            ? `added by ${blog.user.name}`
            : ''
        }
      </div>
      <div>
        {
          blog.user && currentUser.username === blog.user.username
            ? <button onClick={() => handleRemoveBlog(blog)}>remove</button>
            : ''
        }
      </div>
      <h4>comments</h4>
      <form onSubmit={handleComment}>
        <input name="comment" id="comment" type="text"></input>
        <button type="submit">add comment</button>
      </form>
      {
        blog.comments.map(comment => (
          <li key={comment.comment}>{comment.comment}</li>
        ))
      }
    </div>
  )
}

export default Blog