const xmlrpc = require('./client.js')
const parser = require('xml2json-light')

const api = new xmlrpc('https://neos-server.org:3333')

module.exports = function promisify(method, args) {
  return new Promise((resolve, reject) => {
    api.call(method, args, function(error, xml) {
      if (error) return reject(error)
      const json = parser.xml2json(xml)
      return resolve(json)
    })
  })
}
