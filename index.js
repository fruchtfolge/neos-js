import helpers from './src/helpers.js'

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
      const credentials = jobNumber
      jobNumber = credentials.jobNumber
      password = credentials.password
    }
    return helpers.call('getJobStatus', [jobNumber, password])
  },

  getJobInfo(jobNumber, password) {
    if (typeof jobNumber === 'object') {
      const credentials = jobNumber
      jobNumber = credentials.jobNumber
      password = credentials.password
    }
    return helpers.call('getJobInfo', [jobNumber, password])
  },

  killJob(jobNumber, password) {
    if (typeof jobNumber === 'object') {
      const credentials = jobNumber
      jobNumber = credentials.jobNumber
      password = credentials.password
    }
    return helpers.call('killJob', [jobNumber, password])
  },

  getFinalResults(jobNumber, password) {
    if (typeof jobNumber === 'object') {
      const credentials = jobNumber
      jobNumber = credentials.jobNumber
      password = credentials.password
    }
    return helpers.call('getFinalResults', [jobNumber, password])
  },

  getIntermediateResults(jobNumber, password, offset) {
    return helpers.call('getIntermediateResults', [jobNumber, password, offset])
  },

  getFinalResultsNonBlocking(jobNumber, password) {
    if (typeof jobNumber === 'object') {
      const credentials = jobNumber
      jobNumber = credentials.jobNumber
      password = credentials.password
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
}

export default NEOS
