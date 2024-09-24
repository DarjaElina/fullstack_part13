const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const { SECRET } = require('../utils/config')
const { User, Session } = require('../models')

router.post('/', async (req, res, next) => {
  try {
    const { username, password } = req.body

  const user = await User.findOne({
    where: {
      username: username
    }
  })

  const passwordCorrect = user
  ? await bcrypt.compare(password, user.passwordHash)
  : false

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  if (user.disabled) {
    return res.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }

  const now = new Date()

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, SECRET, { expiresIn: '1h' })

  await Session.create({
    userId: user.id,
    expiresAt: new Date(now.getTime() + 60 * 60 * 1000),
    token
  })

  res
    .status(200)
    .send({ token, username: user.username, name: user.name })
  } catch(exception) {
    next(exception)
  }
})

module.exports = router