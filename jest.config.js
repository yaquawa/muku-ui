export default {
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['<rootDir>/packages/*/tests/**/*.spec.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  moduleNameMapper: {
    '^@muku-ui/([^/]*?)$': '<rootDir>/packages/$1/src',
    '^@muku-ui/((?:.*?/)+.*)': '<rootDir>/packages/$1',
  },
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
}
