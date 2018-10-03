const parser = require('fast-xml-parser')

function innerValue(json) {

  function flattenObject(ob) {
    var toReturn = {}
    for (var i in ob) {
      if (!ob.hasOwnProperty(i)) continue
      if ((typeof ob[i]) == 'object') {
        var flatObject = flattenObject(ob[i])
        for (var x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue
          toReturn[i + '.' + x] = flatObject[x]
        }
      } else {
        toReturn[i] = ob[i]
      }
    }
    return toReturn
  }

  return Object.keys(json).map(key => {return json[key]})
}
module.exports = function parse(method, xml) {
  return new Promise((resolve, reject) => {
    const json = parser.parse(xml)
    console.log(xml)
    console.log(innerValue(json))
  })
}
