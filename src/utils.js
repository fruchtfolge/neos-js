const https = require('https')
const json2xml = require('json2xml')
const xml2json = require('fast-xml-parser')
const decode = require('unescape')

module.exports = {
  xmlrpc(method, params) {
    let xml
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

          }) : {
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

    return '<?xml version="1.0"?>' + xml
  },

  call(method, args) {
    return new Promise((resolve, reject) => {
      const request = this.xmlrpc(method, args)

      const options = {
        hostname: 'neos-server.org',
        port: 3333,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': request.length
        }
      }

      const req = https.request(options, (res) => {
        let xmlData

        res.on('data', chunk => {
          xmlData += chunk
        })

        res.on('end', () => {
          const result = this.getJSON(xmlData.toString())
          if (!result) {
            reject('No JSON data found, original XML from NEOS: ' + xmlData)
          } else if (method === 'submitJob' || method === 'authenticatedSubmitJob') {
            resolve({
              jobNumber: result[0],
              password: result[1]
            })
          } else {
            resolve(result)
          }
        })
      })

      req.on('error', (error) => {
        reject(error)
      })

      req.write(request)
      req.end()
    })
  },

  getJSON(xml) {
    const json = xml2json.parse(xml)
    return this.getValue(json)
  },

  getValue(json) {
    const flatRes = this.flattenObject(json)
    const resArray = Object.keys(flatRes).map(x => {
      if (x.includes('base64')) return Buffer.from(flatRes[x], 'base64').toString()
      return flatRes[x]
    })

    if (!resArray || resArray.length === 0) {
      return null
    } else if (resArray.length === 1) {
      return resArray[0]
    } else {
      return resArray
    }
  },

  flattenObject(ob) {
    let toReturn = {}
    for (var i in ob) {
      if (!ob.hasOwnProperty(i)) continue
      if ((typeof ob[i]) == 'object') {
        let flatObject = this.flattenObject(ob[i])
        for (var x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue
          toReturn[i + '.' + x] = flatObject[x]
        }
      } else {
        toReturn[i] = ob[i]
      }
    }
    return toReturn
  },

  prepareJob(template, model, email) {
    return new Promise((resolve, reject) => {
      try {
        template = decode(template)
        // delete insert value placeholders
        const insertValue = new RegExp('...Insert Value Here...', 'g')
        template = template.replace(insertValue, '')
        // insert model
        template = template.replace('<model><![CDATA[\n\n]]></model>',`<model><![CDATA[\n${model}\n]]></model>`)
        // insert email
        template = template.split('</document>')
        return resolve(`${template[0]}\n<email>${email}</email>\n</document>`)
      } catch (e) {
        return reject(e)
      }
    })
  }

}
