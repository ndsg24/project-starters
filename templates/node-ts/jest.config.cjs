module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
    '^.+\\.jsx?$': '<rootDir>/tooling/jest-esm-transform.cjs',
  },
  transformIgnorePatterns: [
    'node_modules/(?!\\.pnpm/|content-disposition/)',
    'node_modules/\\.pnpm/(?!(content-disposition)@)',
  ],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1', '^(\\.{1,2}/.*)\\.js$': '$1' },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.module.ts', '!src/main.ts'],
}
