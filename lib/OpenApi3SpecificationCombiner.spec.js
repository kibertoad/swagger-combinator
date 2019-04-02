const OpenApi3SpecificationCombiner = require('./OpenApi3SpecificationCombiner')
const path = require('path')
const { promisify } = require('util')
const fs = require('fs')
const unlinkAsync = promisify(fs.unlink)
const outputFile = 'specification.yaml'
const yaml = require('js-yaml')

describe('OpenApi3SpecificationCombiner', () => {
  describe('writeSpecAsYaml', () => {
    afterEach(() => {
      return unlinkAsync(outputFile)
    })

    it('happy path', () => {
      const originalSchema = { dummy: 'test' }
      const combiner = new OpenApi3SpecificationCombiner()
      combiner.writeSpecAsYaml(originalSchema, outputFile)
      const loadedSchema = yaml.load(fs.readFileSync(outputFile))
      expect(loadedSchema).toEqual(originalSchema)
    })
  })

  describe('writeSpecAsJson', () => {
    afterEach(() => {
      return unlinkAsync(outputFile)
    })

    it('happy path', () => {
      const originalSchema = { dummy: 'test' }
      const combiner = new OpenApi3SpecificationCombiner()
      combiner.writeSpecAsJson(originalSchema, outputFile)
      const loadedSchema = JSON.parse(fs.readFileSync(outputFile))
      expect(loadedSchema).toEqual(originalSchema)
    })
  })

  describe('generateMergedSpec', () => {
    it('happy path without models', () => {
      const combiner = new OpenApi3SpecificationCombiner()

      const sourcePath =
        path.join(__dirname) + '/__test__/spec/openapi3/input/*.spec.yaml'

      const combinedSchema = combiner.generateMergedSpec(sourcePath)

      const expectedSchema = yaml.load(
        fs.readFileSync(
          'lib/__test__/spec/openapi3/expected/specification-without-models.yaml'
        )
      )

      expect(combinedSchema).toEqual(expectedSchema)
    })

    it('happy path without models multiple sources', () => {
      const combiner = new OpenApi3SpecificationCombiner()

      const sourcePath = [
        'lib/__test__/spec/openapi3/input/root.spec.yaml',
        'lib/__test__/spec/openapi3/input/responses.spec.yaml',
        'lib/__test__/spec/openapi3/input/health.spec.yaml',
      ]

      const combinedSchema = combiner.generateMergedSpec(sourcePath)

      const expectedSchema = yaml.load(
        fs.readFileSync(
          'lib/__test__/spec/openapi3/expected/specification-without-models.yaml'
        )
      )

      expect(combinedSchema).toEqual(expectedSchema)
    })

    it('happy path with models', () => {
      const models = {
        searchResultResponse: {
          jsonSchema: {
            type: 'object',
            required: ['results'],
            properties: {
              results: {
                type: 'array',
                items: {
                  type: 'object',
                },
              },
            },
          },
        },
      }
      const combiner = new OpenApi3SpecificationCombiner()

      const sourcePath =
        path.join(__dirname) + '/__test__/spec/openapi3/input/*.spec.yaml'

      const combinedSchema = combiner.generateMergedSpec(sourcePath, models)

      const expectedSchema = yaml.load(
        fs.readFileSync(
          'lib/__test__/spec/openapi3/expected/specification-with-models.yaml'
        )
      )

      expect(combinedSchema).toEqual(expectedSchema)
    })
  })
})
