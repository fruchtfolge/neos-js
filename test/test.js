const NEOS = require('../index.js')
const fs = require('fs')

// read example GAMS XML job
const xml = fs.readFileSync('test.xml', 'utf-8')

/*
NEOS.getJobStatus(6194621, 'OzZLvyxV')
    .then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
*/
/*
NEOS.help()
    .then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
*/


NEOS.submitJob(xml)
    .then(res => {
        NEOS.getJobStatus(6194621, 'OzZLvyxV')
    })
    .catch(err => {
        console.log(err)
    })
