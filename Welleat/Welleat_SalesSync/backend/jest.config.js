// jest.config.js

module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  testEnvironment: "node",
  setupFiles: ["<rootDir>/test/setup.js"],
  moduleDirectories: ['node_modules', 'src'],
};