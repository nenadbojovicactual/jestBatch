const sum = require('./sum');
const jestBatch = require('./jestBatch');
let expectedValues = { input:[1,2], output: 3};
jestBatch(expectedValues, ['',undefined, null], [], sum, "Test of a sum function");
