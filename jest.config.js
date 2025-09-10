/** 
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

const config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of regexp pattern strings to skip coverage collection
  coveragePathIgnorePatterns: [
    "src/utils",
    "src/context/",
    "src/reducers/",
    "src/directives/",
    "src/services/",
    "src/tests/",
  ],

  // Directories searched recursively when resolving modules
  moduleDirectories: ["node_modules", "src"],

  // Mapping for resource/file imports to mocks
  moduleNameMapper: {
    "\\.(png|jpg|scss)$": "<rootDir>/src/tests/mocks/fileMock.js",
    "\\.svg": "<rootDir>/src/tests/mocks/svgrMock.js",
  },

  // Patterns to ignore when discovering modules
  modulePathIgnorePatterns: ["<rootDir>/src/reducers/search"],

  // Paths to setup scripts before the test framework is installed
  setupFiles: ["./jest.polyfills.js"],

  // Paths to setup scripts after the test framework is installed
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"],

  // Environment for testing (browser-like)
  testEnvironment: "jsdom",

  // Options passed to the test environment
  testEnvironmentOptions: {
    customExportConditions: [""],
  },

  // Glob patterns that Jest uses to detect test files
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],

  // Babel/SWC transform setup for TS/JS files
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: true,
            decorators: true,
          },
          keepClassNames: true,
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
            react: {
              runtime: "automatic",
            },
          },
        },
        module: {
          type: "es6",
          noInterop: false,
        },
      },
    ],
  },

  // Additional options commented out can be enabled if needed

  // clearMocks: false,
  // bail: 0,
  // notify: false,
  // verbose: undefined,
  // etc...
};

module.exports = config;
