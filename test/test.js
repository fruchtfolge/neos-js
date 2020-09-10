/* eslint-disable no-console */
const NEOS = require('../')
const assert = require('assert')
const fs = require('fs')

// read example GAMS transport model
const gms = fs.readFileSync('test/transport_model.gms', 'utf-8')
const realWordModel = fs.readFileSync('test/fruchtfolge.gms', 'utf-8')
// test all methods without args
NEOS.help()
  .then(res => {
    // fs.writeFileSync('test/responses/help.json',JSON.stringify(res),'utf-8')
    const expected = fs.readFileSync('test/responses/help.json','utf-8')
    assert.deepEqual(JSON.stringify(res),expected)
  })
  .catch(err => {
    console.log(err)
  })

NEOS.emailHelp()
  .then(res => {
    // fs.writeFileSync('test/responses/emailHelp.json',JSON.stringify(res),'utf-8')
    const expected = fs.readFileSync('test/responses/emailHelp.json','utf-8')
    assert.deepEqual(JSON.stringify(res),expected)
  })
  .catch(err => {
    console.log(err)
  })

NEOS.welcome()
  .then(res => {
    // fs.writeFileSync('test/responses/welcome.json',JSON.stringify(res),'utf-8')
    const expected = fs.readFileSync('test/responses/welcome.json','utf-8')
    assert.deepEqual(JSON.stringify(res),expected)
  })
  .catch(err => {
    console.log(err)
  })

NEOS.version()
  .then(res => {
    // fs.writeFileSync('test/responses/version.json',JSON.stringify(res),'utf-8')
    const expected = fs.readFileSync('test/responses/version.json','utf-8')
    assert.deepEqual(JSON.stringify(res),expected)
  })
  .catch(err => {
    console.log(err)
  })

NEOS.ping()
  .then(res => {
    const expected = fs.readFileSync('test/responses/ping.json','utf-8')
    assert.deepEqual(JSON.stringify(res),expected)
  })
  .catch(err => {
    console.log(err)
  })

NEOS.printQueue()
  .then(res => {
    if (typeof res !== 'string') throw new Error('printQueue failed')
  })
  .catch(err => {
    console.log(err)
  })

NEOS.listAllSolvers()
  .then(res => {
    // fs.writeFileSync('test/responses/listAllSolvers.json',JSON.stringify(res),'utf-8')
    const expected = fs.readFileSync('test/responses/listAllSolvers.json','utf-8')
    assert.deepEqual(JSON.stringify(res),expected)
  })
  .catch(err => {
    console.log(err)
  })

NEOS.listCategories()
  .then(res => {
    // fs.writeFileSync('test/responses/listCategories.json',JSON.stringify(res),'utf-8')
    const expected = fs.readFileSync('test/responses/listCategories.json','utf-8')
    assert.deepEqual(JSON.stringify(res),expected)
  })
  .catch(err => {
    console.log(err)
  })

// methods with args
NEOS.getSolverTemplate('MILP', 'CPLEX', 'GAMS')
  .then(res => {
    // fs.writeFileSync('test/responses/getSolverTemplate.json',JSON.stringify(res),'utf-8')
    const expected = fs.readFileSync('test/responses/getSolverTemplate.json','utf-8')
    assert.deepEqual(JSON.stringify(res),expected)
  })
  .catch(err => {
    console.log(err)
  })

NEOS.listSolversInCategory('MILP')
  .then(res => {
    // fs.writeFileSync('test/responses/listSolversInCategory.json',JSON.stringify(res),'utf-8')
    const expected = fs.readFileSync('test/responses/listSolversInCategory.json','utf-8')
    assert.deepEqual(JSON.stringify(res),expected)
  })
  .catch(err => {
    console.log(err)
  })

// test README example
NEOS.xmlstring({
  category: 'LP',
  solver: 'CPLEX',
  inputMethod: 'GAMS',
  model: gms,
  email: 'test@test.com'
})
  .then(NEOS.submitJob)
  .then(NEOS.getFinalResults)
  .then(res => {
    if (typeof res !== 'string') throw new Error('GAMS job failed')
    else if (!res.includes('Normal Completion')) throw new Error('GAMS job failed: \n' + res)
  })
  .catch(err => {
    console.error(err)
  })

// test README example with more complex, real world model
NEOS.xmlstring({
  category: 'MILP',
  solver: 'Cbc',
  inputMethod: 'GAMS',
  model: realWordModel
})
  .then(NEOS.submitJob)
  .then(NEOS.getFinalResults)
  .then(res => {
    if (typeof res !== 'string') throw new Error('GAMS job failed')
    else if (!res.includes('Normal Completion')) throw new Error('GAMS job failed: \n' + res)
  })
  .catch(err => {
    console.error(err)
  })

// test solver template version
NEOS.getSolverTemplate('MILP', 'Cbc', 'GAMS')
  .then(template => {
    return NEOS.prepareJob(template, realWordModel, '')
  })
  .then(NEOS.submitJob)
  .then(NEOS.getFinalResults)
  .then(res => {
    if (typeof res !== 'string') throw new Error('GAMS job failed')
    else if (!res.includes('Normal Completion')) throw new Error('GAMS job failed: \n' + res)
  })
  .catch(err => {
    console.error(err)
  })
