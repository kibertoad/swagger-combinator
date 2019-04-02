module.exports = {
  notify: true,
  verbose: true,
  resetMocks: true,
  testEnvironment: 'node',

  testRegex: 'lib/.*\\.spec\\.js$',
  collectCoverage: true,
  collectCoverageFrom: ['lib/**/*.js'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['lib.*/__test__/.*'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}
