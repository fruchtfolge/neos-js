const promisify = require('./src/promisify.js')

const NEOS = {
  // Retrieving information from NEOS
  help() {
    return promisify('help')
  },
  emailHelp() {
    return promisify('emailHelp')
  },
  welcome() {
    return promisify('welcome')
  },
  version() {
    return promisify('version')
  },
  ping() {
    return promisify('ping')
  },
  printQueue() {
    return promisify('printQueue')
  },
  getSolverTemplate(category, solvername, inputMethod) {
    return promisify('getSolverTemplate', [category, solvername, inputMethod])
  },
  listAllSolvers() {
    return promisify('listAllSolvers')
  },
  listCategories() {
    return promisify('listCategories')
  },
  listSolversInCategory(category) {
    return promisify('listSolversInCategory', [category])
  },

  // Submitting Jobs and Retrieving Results from NEOS
  submitJob(xml) {
    return promisify('submitJob', [xml])
  },
  authenticatedSubmitJob(xml, user, password) {
    return promisify('authenticatedSubmitJob', [xml, user, password])
  },
  getJobStatus(jobNumber, password) {
    return promisify('getJobStatus', [jobNumber, password])
  },
  getJobInfo(jobNumber, password) {
    return promisify('getJobInfo', [jobNumber, password])
  },
  killJob(jobNumber, password) {
    return promisify('killJob', [jobNumber, password])
  },
  getFinalResults(jobNumber, password) {
    return promisify('getFinalResults', [jobNumber, password])
  },
  getIntermediateResults(jobNumber, password, offset) {
    return promisify('getIntermediateResults', [jobNumber, password, offset])
  },
  getFinalResultsNonBlocking(jobNumber, password) {
    return promisify('getFinalResultsNonBlocking', [jobNumber, password])
  },
  getIntermediateResultsNonBlocking(jobNumber, password, offset) {
    return promisify('getIntermediateResultsNonBlocking', [jobNumber, password, offset])
  },
  getOutputFile(jobNumber, password, filename) {
    return promisify('getOutputFile', [jobNumber, password, filename])
  }
}

module.exports = NEOS
