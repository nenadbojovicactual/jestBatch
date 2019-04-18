const sum = require('./sum');
const jestBatch = require('./jestBatch');
let expectedValues = { input:[1,2], output: [3,4]};
jestBatch(expectedValues, ['',undefined, null], [], sum,'multiple');
