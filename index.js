const util = require('./src/utils.js')

const NEOS = {
  // Retrieving information from NEOS
  help() {
    return util.call('help')
  },
  emailHelp() {
    return util.call('emailHelp')
  },
  welcome() {
    return util.call('welcome')
  },
  version() {
    return util.call('version')
  },
  ping() {
    return util.call('ping')
  },
  printQueue() {
    return util.call('printQueue')
  },
  getSolverTemplate(category, solvername, inputMethod) {
    return util.call('getSolverTemplate', [category, solvername, inputMethod])
  },
  listAllSolvers() {
    return util.call('listAllSolvers')
  },
  listCategories() {
    return util.call('listCategories')
  },
  listSolversInCategory(category) {
    return util.call('listSolversInCategory', [category])
  },

  // Submitting Jobs and Retrieving Results from NEOS
  submitJob(xml) {
    return util.call('submitJob', [xml])
  },
  authenticatedSubmitJob(xml, user, password) {
    return util.call('authenticatedSubmitJob', [xml, user, password])
  },
  getJobStatus(jobNumber, password) {
    if (typeof jobNumber === 'object') {
      const credentials = jobNumber
      jobNumber = credentials.jobNumber
      password = credentials.password
    }
    return util.call('getJobStatus', [jobNumber, password])
  },
  getJobInfo(jobNumber, password) {
    if (typeof jobNumber === 'object') {
      const credentials = jobNumber
      jobNumber = credentials.jobNumber
      password = credentials.password
    }
    return util.call('getJobInfo', [jobNumber, password])
  },
  killJob(jobNumber, password) {
    if (typeof jobNumber === 'object') {
      const credentials = jobNumber
      jobNumber = credentials.jobNumber
      password = credentials.password
    }
    return util.call('killJob', [jobNumber, password])
  },
  getFinalResults(jobNumber, password) {
    if (typeof jobNumber === 'object') {
      const credentials = jobNumber
      jobNumber = credentials.jobNumber
      password = credentials.password
    }
    return util.call('getFinalResults', [jobNumber, password])
  },
  getIntermediateResults(jobNumber, password, offset) {
    return util.call('getIntermediateResults', [jobNumber, password, offset])
  },
  getFinalResultsNonBlocking(jobNumber, password) {
    if (typeof jobNumber === 'object') {
      const credentials = jobNumber
      jobNumber = credentials.jobNumber
      password = credentials.password
    }
    return util.call('getFinalResultsNonBlocking', [jobNumber, password])
  },
  getIntermediateResultsNonBlocking(jobNumber, password, offset) {
    return util.call('getIntermediateResultsNonBlocking', [jobNumber, password, offset])
  },
  getOutputFile(jobNumber, password, filename) {
    return util.call('getOutputFile', [jobNumber, password, filename])
  },
  prepareJob(template, model, email) {
    return util.prepareJob(template, model, email)
  }
}

module.exports = NEOS
