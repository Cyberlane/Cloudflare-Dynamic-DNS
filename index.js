const schedule = require('node-schedule')
const ExternalIp = require('external-ip')
const template = require('url-template')
const Promise = require('bluebird')
const request = require('request-promise')
const config = require('./config')
const getIp = new ExternalIp()

const zoneUrl = template.parse('https://api.cloudflare.com/client/v4/zones?name={domain}')
const recordUrl = template.parse('https://api.cloudflare.com/client/v4/zones/{zone}/dns_records?name={subDomain}')
const domainUrl = template.parse('https://api.cloudflare.com/client/v4/zones/{zone}/dns_records/{record}')

const getZone = () => {
  return request({
    uri: zoneUrl.expand(config),
    headers: {
      'X-Auth-Email': config.email,
      'X-Auth-Key': config.key,
      'Content-Type': 'application/json'
    },
    json: true
  })
  .then(response => response.result[0].id)
}

const getRecord = (zone) => {
  return request({
    uri: recordUrl.expand({
      zone: zone,
      subDomain: config.subDomain
    }),
    headers: {
      'X-Auth-Email': config.email,
      'X-Auth-Key': config.key,
      'Content-Type': 'application/json'
    },
    json: true
  })
  .then(response => response.result[0].id)
}

const updateDomain = (data) => {
  return request({
    uri: domainUrl.expand(data),
    headers: {
      'X-Auth-Email': config.email,
      'X-Auth-Key': config.key,
      'Content-Type': 'application/json'
    },
    body: {
      type: 'A',
      name: config.subDomain,
      content: data.ip
    },
    json: true
  })
}

const findIp = () => {
  return new Promise((resolve, reject) => {
    getIp((err, ip) => {
      if (err) {
        reject(err)
        return
      }
      resolve(ip)
    })
  })
}

const updateCloudinary = () => {
  return Promise.all([findIp(), getZone()])
    .spread((ip, zone) => {
      return getRecord(zone)
        .then(record => {
          return {
            ip: ip,
            zone: zone,
            record: record
          }
        })
    })
    .then(updateDomain)
    .then(() => console.log('Successfully updated subdomain'))
    .catch(console.error)
}

updateCloudinary()

schedule.scheduleJob('00 00 09 * * *', () => {
  updateCloudinary()
})
