import json2xml from 'json2xml'
import { parse as xml2json } from 'fast-xml-parser'
import decode from 'unescape'
import fetch from 'node-fetch'

export default {
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
  
  async call(method, args) {
    const query = this.xmlrpc(method, args)
    const options = {
      cache: 'no-cache',
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        'Content-Length': query.length
      },
      body: query
    }
    const response = await fetch('https://neos-server.org:3333', options)
    const xml = await response.text()
    const result = this.getJSON(xml)
    if (!result) {
      throw new Error('No JSON data found, original XML from NEOS: ' + xml)
    } else if (method === 'submitJob' || method === 'authenticatedSubmitJob') {
      return {
        jobNumber: result[0],
        password: result[1]
      }
    } else {
      return result
    }
  },
  
  getJSON(xml) {
    const json = xml2json(xml)
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
        // delete 'insert value' placeholders
        const insertValue = new RegExp(/\.\.\.Insert Value Here\.\.\./g)
        template = template.replace(insertValue, '')
        // insert model
        template = template.replace('<model><![CDATA[]]></model>',`<model><![CDATA[\n${model}\n]]></model>`)
        // insert email
        template = template.split('</document>')
        return resolve(`${template[0]}\n<email>${email}</email>\n</document>`)
      } catch (e) {
        return reject(e)
      }
    })
  },
  
  xmlstring(obj) {
    return new Promise ((resolve, reject) => {
      try {
        // wrap contents in CDATA tags
        const xml = Object.keys(obj).reduce((string, key) => {
          return string += `<${key}><![CDATA[${obj[key]}]]></${key}>`
        },'<document>') + '</document>'
        resolve(xml)
      } catch (e) {
        reject(e)
      }
    })
  },
  
  parseXML(string) {
    return new Promise((resolve,reject) => {
      try {
        const json = xml2json(string)
        if (Object.keys(json).length === 1 && json.document) {
          resolve(json.document)
        } else {
          resolve(json)
        }
      } catch (e) {
        reject(e)
      }
    })
  }

}
