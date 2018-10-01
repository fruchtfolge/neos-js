# NEOS Server JavaScript Client

A complete [XML-RPC client](https://neos-server.org/neos/xml-rpc.html) for the [Neos Numerical Optimisation Server](https://neos-server.org/neos/). Works in the browser and Node.js

## Installation
To install via npm:
```
npm install neos-js
```

Or grab a release archive file from the dist folder.

## Examples
Browser:
Check out the GAMS online code editor example

Node.js
```js
const NEOS = require('neos-js')
const fs = require('fs')

// load a simulation model, in this case a GAMS file
const model = fs.readFileSync('test.gms', 'utf-8')

// convert the simulation into a NEOS XML string, 
// solve and await the results
NEOS.getSolverTemplate('MILP', 'CPLEX', 'XML-RPC')
.then(template => {
  return NEOS.prepareJob(template, model)
})
.then(NEOS.submitJob)
.then(Neos.getFinalResults)
.then(res => {
  // work with the results
})
.catch(err => {
  // handle errors
})
```
## Methods
For a complete list of the available methods, visit the [Neos Server XML-RPC API documentation](https://neos-server.org/neos/xml-rpc.html).

Additional methods:  
```prepareJob(template, modelString)```  
Convenience method. Converts your simulation model (string) into the required NEOS XML format that you get from the ```getSolverTemplate``` method.

## Contribution

Contribution is highly appreciated! Make sure to ```npm test``` before submitting a PR

## License
MIT
