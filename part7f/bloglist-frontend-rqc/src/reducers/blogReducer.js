import { createSlice, current } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

// const blogsAtStart = [
//   'If it hurts, do it more often',
//   'Adding manpower to a late software project makes it later!',
//   'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//   'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//   'Premature optimization is the root of all evil.',
//   'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
// ]

// const getId = () => (100000 * Math.random()).toFixed(0)

// const asObject = (blog) => {
//   return {
//     content: blog,
//     id: getId(),
//     likes: 0
//   }
// }

// const initialState = blogsAtStart.map(asObject)

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    likeBlog(state, action) {
      console.log(current(state))
      const id = action.payload
      const blogToLike = state.find(a => a.id === id)
      const changedBlog = {
        ...blogToLike,
        likes: blogToLike.likes + 1
      }
      return state.map(blog =>
        blog.id !== id ? blog : changedBlog
      )
    },
    appendBlog(state, action) {
      console.log('action.payload', action.payload)
      return [...state, action.payload]
    },
    setBlogs(state, action) {
      console.log('setBlogs')
      return action.payload
    },
    removeBlog(state, action) {
      console.log('removeBlog')
      return [...state].filter(item => item.id !== action.payload)
    }
  }
})

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    console.log('blogs', blogs)
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = content => {
  return async dispatch => {
    console.log('content', content)
    const newBlog = await blogService.create(content)
    dispatch(appendBlog(newBlog))
  }
}

export const deleteBlog = id => {
  return async dispatch => {
    console.log('deleteBlog')
    await blogService.remove(id)
    dispatch(removeBlog(id))
  }
}

export const addLike = (object) => {
  return async dispatch => {
    const newObject = { ...object, user: object.user.id, likes: object.likes + 1 }
    console.log('newObject', newObject)
    const changedBlog = await blogService.update(newObject.id, newObject)
    dispatch(likeBlog(changedBlog.id))
  }
}

export const { appendBlog, likeBlog, setBlogs, removeBlog } = blogSlice.actions
export default blogSlice.reducer