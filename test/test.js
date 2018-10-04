const NEOS = require('../index.js')
const fs = require('fs')
// read example GAMS XML job
const xml = fs.readFileSync('test.xml', 'utf-8')
const gms = fs.readFileSync('test.gms', 'utf-8')

/*
NEOS.submitJob(xml)
.then(NEOS.getFinalResults)
.then((res) => {
  console.log(res)
  fs.writeFileSync('responses/result.json',JSON.stringify(res),'utf-8')
})
.catch(err => {
  console.log(err)
})
*/
/*
NEOS.getSolverTemplate('milp', 'cplex', 'gams')
.then(res => {
  console.log(res)
  fs.writeFileSync('responses/getSolverTemplate.json',JSON.stringify(res),'utf-8')
})
.catch(err => {
  console.log(err)
})


NEOS.prepareJob(`&lt;document&gt;
&lt;category&gt;milp&lt;/category&gt;
&lt;solver&gt;CPLEX&lt;/solver&gt;
&lt;inputMethod&gt;gams&lt;/inputMethod&gt;

&lt;/document&gt;`,gms)
.then(res => {
  console.log(res)
})
.catch(err => {
  console.log(err)
})
*/
NEOS.getSolverTemplate('MILP', 'CPLEX', 'GAMS')
.then(template => {
  return NEOS.prepareJob(template, gms, 'test@test.com')
})
.then(NEOS.submitJob)
.then(NEOS.getFinalResults)
.then(res => {
  console.log(res)
})
.catch(err => {
  console.log(err)
})
