const xmlrpc = require('./client.js')

const api = new xmlrpc('https://neos-server.org:3333')

module.exports = function promisify(method, args) {
    return new Promise((resolve, reject) => {
        api.call(method, args, function(error, value) {
            if (error) return reject(error)
            return resolve(value)
        })
    })
}
