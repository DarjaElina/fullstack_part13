const router = require('express').Router()
const { tokenExtractor, checkSessionStatus } = require('../utils/middleware')

const { Readings } = require('../models')

router.post('/', tokenExtractor, checkSessionStatus, async (req, res, next) => {
  const { blogId } = req.body
  const userId = req.decodedToken.id

  try {
    await Readings.create({
      userId,
      blogId
    })
    res.status(200).json({ message: 'Blog added to reading list' })
  } catch(exception) {
    next(exception)
  }
})

router.put('/:id', tokenExtractor, checkSessionStatus, async (req, res, next) => {
  const reading = await Readings.findByPk(req.params.id)
  const userId = req.decodedToken.id

  try {
    if (userId === reading.userId) {
      reading.read = req.body.read
      await reading.save()
      return res.status(200).json({ message: 'Blog marked as read' })
    } else return res.status(403).json({ error: 'You can only mark the blogs in your own reading list as read'})
  } catch(exception) {
    next(exception)
  }
})

module.exports = router