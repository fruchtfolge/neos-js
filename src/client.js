const https = require('https')
const json2xml = require('json2xml')

const HEADER = '<?xml version="1.0"?>'

let xml

function Client(url) {
  this.url = url
}

var proto = Client.prototype

proto.call = function(method, params, cb) {
  if (params) {
    var xmlParams =
      params instanceof Array ?
        params.map(function(p) {
          if (typeof p === 'string') {
            return {
              param: {
                value: p
              }
            }
          } else {
            return {
              param: {
                int: p
              }
            }
          }

        }) :
        {
          param: {
            value: {
              struct: Object.keys(params).map(function(k) {
                return {
                  member: {
                    name: k,
                    value: params[k]
                  }
                }
              })
            }
          }
        }

    xml = json2xml({
      methodCall: {
        methodName: method,
        params: xmlParams
      }
    })
  } else {
    xml = json2xml({
      methodCall: {
        methodName: method
      }
    })
  }


  xml = HEADER + xml

  const options = {
    hostname: 'neos-server.org',
    port: 3333,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': xml.length
    }
  }

  const req = https.request(options, (res) => {
    res.on('end', (data) => {
      resolve(data)
    })
  })

  req.on('error', (e) => {
    reject(e)
  })

}

module.exports = Client
