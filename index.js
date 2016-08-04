'use strict'

const schedule = require('node-schedule')
const ExternalIp = require('external-ip')
const Promise = require('bluebird')
const cloudflare = require('./cloudflare')
const getIp = new ExternalIp()

const findIp = () => {
  return new Promise((resolve, reject) => {
    getIp((err, ip) => {
      if (err) {
        reject(err)
      } else {
        resolve(ip)
      }
    })
  })
}

const updateCloudinary = () => {
  return Promise.all([findIp(), cloudflare.getZone()])
    .spread((ip, zone) => {
      return cloudflare.getRecord(zone)
        .then(record => {
          return {
            ip: ip,
            zone: zone,
            record: record
          }
        })
    })
    .then(cloudflare.updateDomain)
    .then(() => console.log('Successfully updated subdomain'))
    .catch(console.error)
}

updateCloudinary()

schedule.scheduleJob('00 00 09 * * *', () => {
  updateCloudinary()
})
