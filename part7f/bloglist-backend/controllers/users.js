const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (username.length < 3) {
        return response.status(400).json({ error: 'username must be at least 3 chars' })
    }

    if (password.length < 3) {
        return response.status(400).json({ error: 'password must be at least 3 chars' })
    }
  
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
  
    const user = new User({
      username,
      name,
      passwordHash,
    })
  
    const savedUser = await user.save()
  
    response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('blogs', { url: 1, title: 1, author: 1, likes: 1 })
    response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
    const user = await User.findById(request.params.id).populate('blogs')

    if (user) {
        response.json(user)
    } else {
        response.status(404).end()
    }
})

module.exports = usersRouter