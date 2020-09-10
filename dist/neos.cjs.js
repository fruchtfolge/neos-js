'use strict';

var json2xml = require('json2xml');
var fastXmlParser = require('fast-xml-parser');
var decode = require('unescape');
var fetch = require('node-fetch');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var json2xml__default = /*#__PURE__*/_interopDefaultLegacy(json2xml);
var decode__default = /*#__PURE__*/_interopDefaultLegacy(decode);
var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);

var helpers = {
  xmlrpc(method, params) {
    let xml;
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
          };

      xml = json2xml__default['default']({
        methodCall: {
          methodName: method,
          params: xmlParams
        }
      });
    } else {
      xml = json2xml__default['default']({
        methodCall: {
          methodName: method
        }
      });
    }

    return '<?xml version="1.0"?>' + xml
  },
  
  async call(method, args) {
    const query = this.xmlrpc(method, args);
    const options = {
      cache: 'no-cache',
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        'Content-Length': query.length
      },
      body: query
    };
    const response = await fetch__default['default']('https://neos-server.org:3333', options);
    const xml = await response.text();
    const result = this.getJSON(xml);
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
    const json = fastXmlParser.parse(xml);
    return this.getValue(json)
  },

  getValue(json) {
    const flatRes = this.flattenObject(json);
    const resArray = Object.keys(flatRes).map(x => {
      if (x.includes('base64')) return Buffer.from(flatRes[x], 'base64').toString()
      return flatRes[x]
    });

    if (!resArray || resArray.length === 0) {
      return null
    } else if (resArray.length === 1) {
      return resArray[0]
    } else {
      return resArray
    }
  },

  flattenObject(ob) {
    let toReturn = {};
    for (var i in ob) {
      if (!ob.hasOwnProperty(i)) continue
      if ((typeof ob[i]) == 'object') {
        let flatObject = this.flattenObject(ob[i]);
        for (var x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue
          toReturn[i + '.' + x] = flatObject[x];
        }
      } else {
        toReturn[i] = ob[i];
      }
    }
    return toReturn
  },

  prepareJob(template, model, email) {
    return new Promise((resolve, reject) => {
      try {
        template = decode__default['default'](template);
        // delete 'insert value' placeholders
        const insertValue = new RegExp(/\.\.\.Insert Value Here\.\.\./g);
        template = template.replace(insertValue, '');
        // insert model
        template = template.replace('<model><![CDATA[]]></model>',`<model><![CDATA[\n${model}\n]]></model>`);
        // insert email
        template = template.split('</document>');
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
        },'<document>') + '</document>';
        resolve(xml);
      } catch (e) {
        reject(e);
      }
    })
  },
  
  parseXML(string) {
    return new Promise((resolve,reject) => {
      try {
        const json = fastXmlParser.parse(string);
        if (Object.keys(json).length === 1 && json.document) {
          resolve(json.document);
        } else {
          resolve(json);
        }
      } catch (e) {
        reject(e);
      }
    })
  }

};

const NEOS = {
  // Retrieving information from NEOS
  help() {
    return helpers.call('help')
  },
  emailHelp() {
    return helpers.call('emailHelp')
  },
  welcome() {
    return helpers.call('welcome')
  },
  version() {
    return helpers.call('version')
  },
  ping() {
    return helpers.call('ping')
  },
  printQueue() {
    return helpers.call('printQueue')
  },
  getSolverTemplate(category, solvername, inputMethod) {
    return helpers.call('getSolverTemplate', [category, solvername, inputMethod])
  },
  listAllSolvers() {
    return helpers.call('listAllSolvers')
  },
  listCategories() {
    return helpers.call('listCategories')
  },
  listSolversInCategory(category) {
    return helpers.call('listSolversInCategory', [category])
  },

  // Submitting Jobs and Retrieving Results from NEOS
  submitJob(xml) {
    return helpers.call('submitJob', [xml])
  },

  authenticatedSubmitJob(xml, user, password) {
    return helpers.call('authenticatedSubmitJob', [xml, user, password])
  },

  getJobStatus(jobNumber, password) {
    if (typeof jobNumber === 'object') {
      const credentials = jobNumber;
      jobNumber = credentials.jobNumber;
      password = credentials.password;
    }
    return helpers.call('getJobStatus', [jobNumber, password])
  },

  getJobInfo(jobNumber, password) {
    if (typeof jobNumber === 'object') {
      const credentials = jobNumber;
      jobNumber = credentials.jobNumber;
      password = credentials.password;
    }
    return helpers.call('getJobInfo', [jobNumber, password])
  },

  killJob(jobNumber, password) {
    if (typeof jobNumber === 'object') {
      const credentials = jobNumber;
      jobNumber = credentials.jobNumber;
      password = credentials.password;
    }
    return helpers.call('killJob', [jobNumber, password])
  },

  getFinalResults(jobNumber, password) {
    if (typeof jobNumber === 'object') {
      const credentials = jobNumber;
      jobNumber = credentials.jobNumber;
      password = credentials.password;
    }
    return helpers.call('getFinalResults', [jobNumber, password])
  },

  getIntermediateResults(jobNumber, password, offset) {
    return helpers.call('getIntermediateResults', [jobNumber, password, offset])
  },

  getFinalResultsNonBlocking(jobNumber, password) {
    if (typeof jobNumber === 'object') {
      const credentials = jobNumber;
      jobNumber = credentials.jobNumber;
      password = credentials.password;
    }
    return helpers.call('getFinalResultsNonBlocking', [jobNumber, password])
  },

  getIntermediateResultsNonBlocking(jobNumber, password, offset) {
    return helpers.call('getIntermediateResultsNonBlocking', [jobNumber, password, offset])
  },

  getOutputFile(jobNumber, password, filename) {
    return helpers.call('getOutputFile', [jobNumber, password, filename])
  },

  prepareJob(template, model, email) {
    return helpers.prepareJob(template, model, email)
  },
  
  xmlstring(obj) {
    return helpers.xmlstring(obj)
  },
  
  parseXML(string) {
    return helpers.parseXML(string)
  }
};

module.exports = NEOS;
