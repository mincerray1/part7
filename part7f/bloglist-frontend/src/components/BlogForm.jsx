import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'

const BlogForm = ({ createBlog }) => {
  const [newtitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const dispatch = useDispatch()

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newtitle,
      author: newAuthor,
      url: newUrl,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')

    dispatch(setNotification(`blog ${newtitle} added`, 'success', 2))
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:{' '}
          <input
            id="title"
            type="text"
            name="title"
            onChange={(event) => setNewTitle(event.target.value)}
            value={newtitle}
          />
        </div>
        <div>
          author:{' '}
          <input
            id="author"
            type="text"
            name="author"
            onChange={(event) => setNewAuthor(event.target.value)}
            value={newAuthor}
          />
        </div>
        <div>
          url:{' '}
          <input
            id="url"
            type="text"
            name="url"
            onChange={(event) => setNewUrl(event.target.value)}
            value={newUrl}
          />
        </div>
        <button id="create" type="submit">
          create
        </button>
      </form>
    </div>
  )
}

export default BlogForm
