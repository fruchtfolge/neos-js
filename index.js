const promisify = require('./src/promisify.js')

const NEOS = {
	submitJob(xml) {
		return promisify('submitJob', [xml])
	},
	getJobStatus(jobNumber,password) {
		return promisify('getJobStatus', [jobNumber,password])
	},
	help() {
		return promisify('help')
	},
	ping() {
		return promisify('ping')
	}
}

module.exports = NEOS
