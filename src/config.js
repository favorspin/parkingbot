'use strict'

const dotenv = require('dotenv')
const ENV = process.env.NODE_ENV || 'development'

if (ENV === 'development') dotenv.config();

const config = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  PARKINGBOT_COMMAND_TOKEN: process.env.PARKINGBOT_COMMAND_TOKEN,
  SLACK_TOKEN: process.env.SLACK_TOKEN
}

module.exports = (key) => {
  if (!key) return config

  return config[key];
}