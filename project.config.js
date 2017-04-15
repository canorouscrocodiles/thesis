const projectName = process.env.NAME || 'thesis'
const env = process.env.ENV || 'test'
const dbHost = process.env.DATABASE_URL || `postgres://Sent:@localhost:5432/${projectName}_${env}`
const secret = process.env.SECRET || '4265e6b1-23bd-43a6-a024-577f52a01019'

module.exports = {
  dbHost,
  secret
}
