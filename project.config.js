const projectName = process.env.NAME || 'thesis'
const env = process.env.ENV || 'test'
const dbHost = process.env.DATABASE_URL || `postgres://JongK:@localhost:5432/${projectName}_${env}`

module.exports = dbHost
