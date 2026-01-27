// jest.config.js
module.exports = {
  // Use the "node" environment for backend testing
  testEnvironment: 'node', 

  // Specify which files Jest should look for as test files
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],

  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"]
};