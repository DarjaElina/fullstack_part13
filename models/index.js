const Blog = require('./blog')
const User = require('./user')
const Readings = require('./readings')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: Readings, as: 'reading_list' })
Blog.belongsToMany(User, { through: Readings, as: 'read_by_users' })

User.hasMany(Readings)
Readings.belongsTo(User)

Blog.hasMany(Readings, {as: 'user_readings'})
Readings.belongsTo(Blog)

module.exports = {
  Blog, User, Readings
}