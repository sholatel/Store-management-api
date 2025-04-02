module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./src/test/setup.ts'],
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/src/test/',
      '/src/config/'
    ]
  };