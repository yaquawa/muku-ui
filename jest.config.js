export default {
  testMatch: ['<rootDir>/packages/*/tests/**/*.spec.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.vue$': 'vue-jest',
  },
  moduleNameMapper: {
    '^@muku-ui/([^/]*?)$': '<rootDir>/packages/$1/src',
    '^@muku-ui/((?:.*?/)+.*)': '<rootDir>/packages/$1',
  },
};
