const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()

  console.log(JSON.stringify(blogs, null, 2))

  res.json(blogs)
})

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    return res.json(blog)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.delete('/:id', blogFinder, async (req, res) => {
  try {
    await req.blog.destroy()
    return res.status(204).end()
  } catch (error) {
    return res.status(400).json({ error })
  }
})

module.exports = router