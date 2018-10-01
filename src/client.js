const request = require('superagent')
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

  request
    .post(this.url)
    .send(xml)
    .end(function(err, res) {
      if (err) return cb(err)
      cb(null, res.text)
    })
}

module.exports = Client
