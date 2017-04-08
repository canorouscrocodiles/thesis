const projectName = process.env.NAME || 'thesis'
const env = process.env.ENV || 'test'
const dbPassword = process.env.DBPASSWORD || null
const dbHost = process.env.DBHOST || 'localhost'
const port = process.env.DBPORT || 5432
const dbName = `${projectName}_${env}`
const user = process.env.USER || 'root'
const config = {}

config.db = {
  host: dbHost,
  port: port,
  database: dbName,
  user: user,
  password: dbPassword
}

module.exports = config
