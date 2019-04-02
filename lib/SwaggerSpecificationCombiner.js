const _ = require('lodash')
const AbstractSpecificationCombiner = require('./AbstractSpecificationCombiner')

// Swagger aka OpenAPI 2.0
class SwaggerSpecificationCombiner extends AbstractSpecificationCombiner {
  constructor() {
    super({
      swagger: {},
      info: {},
      host: {},
      paths: {},
      responses: {},
      definitions: {},
    })
  }

  /**
   * Generate Swagger schemas from the Objection models defined in services'
   * modelSpecMap. This passes Objection model to convert to the Swagger schema.
   *
   * @param {Object} models
   * @param {Object} mergedSpecs
   * @return {Object}
   * @private
   */
  _toOpenApiSchemas(models, mergedSpecs) {
    const toOpenApiFn = require('objection-swagger').generateSchemaRaw
    const modelSchemas = _.transform(
      models,
      (result, model, modelName) => {
        result[modelName] = toOpenApiFn(model)[0].schema
      },
      {}
    )

    // Merge schemas generated from models into specification
    Object.assign(mergedSpecs.definitions, modelSchemas)
    return modelSchemas
  }
}

module.exports = SwaggerSpecificationCombiner
