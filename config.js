'use strict'

require('dotenv').load()

module.exports = {
  email: process.env.email,
  key: process.env.key,
  domain: process.env.domain,
  subDomain: process.env.subDomain
}

