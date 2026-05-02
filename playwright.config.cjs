module.exports = {
  testDir: 'tests',
  timeout: 90000,
  expect: { timeout: 10000 },
  use: {
    baseURL: 'http://127.0.0.1:8877',
    trace: 'off'
  }
};
