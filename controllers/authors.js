const router = require('express').Router()

const { Blog } = require('../models')
const { sequelize } = require('../utils/db')

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      [sequelize.fn('COALESCE', sequelize.col('author'), 'Unknown'), 'author'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
    ],
    group: 'author',
    order: [
      [sequelize.literal('likes'), 'DESC']
    ]
  })

  res.json(authors)
})

module.exports = router