const router = require('express').Router()
const { Blog, User, Session } = require('../models')
const { Op } = require('sequelize')
const { tokenExtractor, checkSessionStatus } = require('../utils/middleware')

router.get('/', async (req, res) => {
  const where = {}


  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${req.query.search}%`
        }
      },
      {
        author: {
          [Op.iLike]: `%${req.query.search}%`
        }
      }
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [
      ['likes', 'DESC']
    ]
  })


  res.json(blogs)
})

router.post('/', tokenExtractor, checkSessionStatus, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
    res.json(blog)
  } catch (exception) {
    next(exception)
  }
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.delete('/:id', blogFinder,tokenExtractor, checkSessionStatus, async (req, res, next) => {
  try {
      const user = await User.findByPk(req.decodedToken.id)
      if (user.id === req.blog.userId) {
        await req.blog.destroy()
        res.status(204).end()
      } else {
        return res.status(403).json({ error: 'blog can be deleted only by its creator' })
      }
  } catch (exception) {
    next(exception)
  }
})

router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    if (req.blog) {
      req.blog.likes = req.body.likes
      await req.blog.save()
      res.json(req.blog)
    } else {
      res.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})

module.exports = router