const router = require('express').Router()

const { Session } = require('../models')

const { tokenExtractor } = require('../utils/middleware')

router.delete('/', tokenExtractor, async (req, res) => {
  const session = await Session.findOne({ 
    where: { 
      userId: req.decodedToken.id,
      token: req.token
    }
  })
  
  if (!session) {
    return res.status(404).json({ error: 'No active session found.' })
  }

  await session.destroy()
  res.status(204).end()
})

module.exports = router