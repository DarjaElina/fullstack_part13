const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: {
      exclude: ['passwordHash'],
    },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  const { username, name, password } = req.body

  if (!username || !name || !password) {
    return res.status(400).json({ error: 'Username, name, and password are required'})
  }

  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = await User.create({
      username,
      name,
      passwordHash,
    })
    res.json({username: user.username, name: user.name})
  } catch(exception) {
    next(exception)
  }
})

router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.params.username
      }
    })
    user.username = req.body.username
    await user.save()
    res.json({username: user.username, name: user.name})
  } catch(exception) {
    next(exception)
  }
})

module.exports = router