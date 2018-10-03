const NEOS = require('../index.js')
const fs = require('fs')
// read example GAMS XML job
const xml = fs.readFileSync('test.xml', 'utf-8')

NEOS.listAllSolvers()
  .then(res => {
    console.log(res)
    fs.writeFileSync('responses/listAllSolvers.xml',res,'utf-8')
  })
  .catch(err => {
    console.log(err)
  })
