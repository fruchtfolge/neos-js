'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var https = require('https');
var json2xml = _interopDefault(require('json2xml'));
var fastXmlParser = require('fast-xml-parser');
var decode = _interopDefault(require('unescape'));

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

      xml = json2xml({
        methodCall: {
          methodName: method,
          params: xmlParams
        }
      });
    } else {
      xml = json2xml({
        methodCall: {
          methodName: method
        }
      });
    }

    return '<?xml version="1.0"?>' + xml
  },

  call(method, args) {
    return new Promise((resolve, reject) => {
      const query = this.xmlrpc(method, args);
      const options = {
        hostname: 'neos-server.org',
        port: 3333,
        protocol: 'https:',
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          'Content-Length': query.length
        }
      };

      const req = https.request(options, (res) => {
        let xmlData;

        res.on('data', chunk => {
          xmlData += chunk;
        });

        res.on('end', () => {
          const result = this.getJSON(xmlData.toString());
          if (!result) {
            reject('No JSON data found, original XML from NEOS: ' + xmlData);
          } else if (method === 'submitJob' || method === 'authenticatedSubmitJob') {
            resolve({
              jobNumber: result[0],
              password: result[1]
            });
          } else {
            resolve(result);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(query);
      req.end();
    })
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
        template = decode(template);
        // delete insert value placeholders
        const insertValue = new RegExp(/<!\[CDATA\[\n\.\.\.Insert Value Here\.\.\.\n\]\]>/g);
        template = template.replace(insertValue, '');
        // insert model
        template = template.replace('<model></model>',`<model><![CDATA[\n${model}\n]]></model>`);
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
        // wrap contents in CDATA tags, mutate original object
        Object.keys(obj).forEach(key => {
          if (obj[key]) obj[key] = `<![CDATA[${obj[key]}]]>`;
        });
        let string = json2xml({document: obj});
        string = string
          .replace(/&lt;!\[CDATA\[/g, '<![CDATA[')
          .replace(/\]\]&gt;/g, ']]>');
        resolve(string);
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
