const { SECRET } = require('../utils/config')
const jwt = require('jsonwebtoken')
const { Session, User } = require('../models')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const checkSessionStatus = async (req, res, next) => {
  const session = await Session.findOne({ where: { userId: req.decodedToken.id} })
  const user = await User.findByPk(req.decodedToken.id)

  if (!session) {
    return res.status(401).json({ error: 'session expired, please log in' })
  }

  if (new Date() > new Date(session.expiresAt)) {
    await session.destroy()
    return res.status(401).json({ error: 'Session expired, please log in.' })
  }

  if (user.disabled) {
    await session.destroy()
    return res.status(401).json({ error: 'Account disabled, please contact admin' })
  }
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.name)

  if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).json({ error: 'Invalid input or operation' })
  }
  if (error.name === 'SequelizeConnectionError') {
    return response.status(503).json({ error: 'Database connection error' })
  } 
  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.message,  })
  }
  if (error.name === 'SequelizeUniqueConstraintError') {
    console.log(error.message)
    const field = error.errors[0].path
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
    return response.status(400).json({ error: message })
  }
  next(error)
}

module.exports = {
  errorHandler,
  tokenExtractor,
  checkSessionStatus
}