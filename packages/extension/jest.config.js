module.exports = {
  setupFiles: ['jest-webextension-mock', 'jest-localstorage-mock'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  coverageDirectory: './coverage/',
  collectCoverage: !!process.env.CI,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/popup/**/*.*',
    '!src/background.ts',
    '!src/options/options.ts',
  ],
};
