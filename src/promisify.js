const xmlrpc = require('./client.js')
const parse = require('./xml2js.js')

const api = new xmlrpc('https://neos-server.org:3333')


module.exports = {
  promisify(method, args) {
    return new Promise((resolve, reject) => {
      api.call(method, args, function(error, xml) {
        if (error) return reject(error)
  //      parse(method, xml)
  //      .then(json => {
          return resolve(xml)
  //      })
  //      .catch(e => {
  //        return reject(e)
  //      })
      })
    })
  }
}
