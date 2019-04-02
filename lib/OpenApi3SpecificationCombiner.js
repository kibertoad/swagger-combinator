const _ = require('lodash')
const AbstractSpecificationCombiner = require('./AbstractSpecificationCombiner')

class OpenApi3SpecificationCombiner extends AbstractSpecificationCombiner {
  constructor() {
    super({
      openapi: {},
      info: {},
      servers: {},
      paths: {},
      components: {
        schemas: {},
      },
    })
  }

  /**
   * Generate OpenAPI schemas from the Objection models defined in services'
   * modelSpecMap. This uses the jsonSchema property in an Objection model to
   * convert to the OpenAPI schema.
   *
   * @param {Object} models
   * @param {Object} mergedSpecs
   * @return {Object}
   * @private
   */
  _toOpenApiSchemas(models, mergedSpecs) {
    const toOpenApiFn = require('json-schema-to-openapi-schema')
    const modelSchemas = _.transform(
      models,
      (result, model, modelName) => {
        result[modelName] = toOpenApiFn(model.jsonSchema)
      },
      {}
    )

    // Merge schemas generated from models into specification
    Object.assign(mergedSpecs.components.schemas, modelSchemas)
    return modelSchemas
  }
}

module.exports = OpenApi3SpecificationCombiner
