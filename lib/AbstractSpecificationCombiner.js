const glob = require('glob')
const yaml = require('js-yaml')
const _ = require('lodash')
const fs = require('fs')
const validate = require('validation-utils')

class AbstractSpecificationCombiner {
  /**
   *
   * @param {Object} rootStructure
   */
  constructor(rootStructure) {
    validate.object_(rootStructure, 'Root structure is mandatory')

    this.rootStructure = rootStructure
  }

  /**
   * Generate one spec file from an array of spec file paths.
   * @param {string|string[]} sources - array of spec file sources. Paths may contain
   *                             globbing patterns
   * @param {Object} [models] - map of models
   */
  generateMergedSpec(sources, models) {
    validate.notEmpty(sources, 'Sources are mandatory')

    if (!Array.isArray(sources)) {
      sources = [sources]
    }
    const paths = _toFilePaths(sources)
    const mergedSpecs = this._mergeSpecFiles(paths)

    if (models) {
      this._toOpenApiSchemas(models, mergedSpecs)
    }

    return mergedSpecs
  }

  /**
   * Write specification to configured output file as YAML
   * @param {Object} specification
   * @param {string} outputFile
   */
  writeSpecAsYaml(specification, outputFile) {
    validate.object_(specification, 'Specification is mandatory')
    validate.string(outputFile, 'Output file is mandatory')

    // Generate YAML
    const specYaml = yaml.safeDump(specification)

    // Write to output file
    fs.writeFileSync(outputFile, specYaml)
  }

  /**
   * Write specification to configured output file as JSON
   * @param {Object} specification
   * @param {string} outputFile
   */
  writeSpecAsJson(specification, outputFile) {
    validate.object_(specification, 'Specification is mandatory')
    validate.string(outputFile, 'Output file is mandatory')

    // Generate JSON
    const specJson = JSON.stringify(specification)

    // Write to output file
    fs.writeFileSync(outputFile, specJson)
  }

  /**
   * Read and merge spec files' contents into one big object.
   */
  _mergeSpecFiles(filePaths) {
    return filePaths.reduce((spec, file) => {
      const specPartial = yaml.safeLoad(fs.readFileSync(file, 'utf8'))

      return _.merge(spec, specPartial)
    }, this.rootStructure)
  }

  /* istanbul ignore next */
  /**
   * Generate OpenAPI schemas from the Objection models defined in services'
   * modelSpecMap. This uses the jsonSchema property in an Objection model to
   * convert to the OpenAPI schema.
   *
   * @param {Object} models
   * @param mergedSpecs - mutated during this operation
   * @return {Object}
   * @private
   */
  _toOpenApiSchemas(models, mergedSpecs) {
    throw new Error('Not implemented')
  }
}

/**
 * Get spec file paths for given (glob) paths.
 */
function _toFilePaths(sources) {
  return _.flatten(
    sources.map(g => {
      return glob.sync(g, { nodir: true })
    })
  )
}

module.exports = AbstractSpecificationCombiner
