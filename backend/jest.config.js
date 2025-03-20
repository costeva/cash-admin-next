/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  preset: "ts-jest",
  detectOpenHandles: true,
  openHandlesTimeout: 12 * 1000,
  testTimeout: 12 * 1000,
};
