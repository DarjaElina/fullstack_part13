const errorHandler = (error, request, response, next) => {
  console.error(error.name)

  if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).json({ error: 'Invalid input or operation' })
  }
  if (error.name === 'SequelizeConnectionError') {
    return response.status(503).json({ error: 'Database connection error' })
  }

  next(error)
}

module.exports = {
  errorHandler
}