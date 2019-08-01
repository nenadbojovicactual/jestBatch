//* ***************************** */jestHelper v1.00*************************************
function isArray(obj) {
  return !!obj && obj.constructor === Array;
}
function inArray(arr, compareTo) {
  const length = arr.length;
  for (let i = 0; i < length; i++) {
    if (isArray(arr[i])) {
      if (JSON.stringify(arr[i]) === JSON.stringify(compareTo)) {
        return true;
      }
    }
  }
  return false;
}
function reduceLength(getString, n) {
  if (getString && n && n > 0) {
    return getString.length > n ? `${getString.substring(0, n)}...` : getString;
  }
  return getString;
}
module.exports =  function jestHelper(expected, testAll, specificValue, func, type, reduce) {
  const funcName = func.name;
  // parametars used:
  // expected: object or an array of objects with properties input which holds an array of values used in the function, and output. Example of object: : { input:[1,2], output: 3};
  // testAll: single value or an array of values to test against the function with the expected values
  // specificValue: is an object or an array of object with properties: value and position. Example of object: { position:1, value: 2};
  // func: function to be tested
  // funcName: is a function name or description
  // type : can be 'typeof', 'single', 'multiple'
  // reduce length of elements
  let checkAllOnce = false;
  let arrExpected = [];
  let arrTestAll = [];
  let arrSpecificValue = [];
  if (!isArray(expected)) {
    arrExpected.push(expected);
  } else {
    arrExpected = expected.slice();
  }
  if (!isArray(testAll)) {
    arrTestAll.push(testAll);
  } else {
    arrTestAll = testAll.slice();
  }
  if (!isArray(specificValue)) {
    arrSpecificValue.push(specificValue);
  } else {
    arrSpecificValue = specificValue.slice();
  }
  let check = true;

  arrExpected.forEach((exp) => {
    if (!exp.hasOwnProperty('input') || !exp.hasOwnProperty('output')) {
      check = false;
      console.log('Expected value is not in a correct format.');
    }
  });
  arrSpecificValue.forEach((exp) => {
    if (!exp.hasOwnProperty('position') || !exp.hasOwnProperty('value')) {
      check = false;
      console.log('Specific value is not in a correct format.');
    }
  });
  if (func instanceof Function === false) {
    check = false;
    console.log('You have not supplied a function');
  }
  if (type !== 'typeof' && type !== 'single' && type !== 'multiple') {
    check = false;
    console.log('You have not supplied a proper type value');
  }
  if (check) {
    arrExpected.forEach((a) => {
      let message = a.input;
      if (typeof a.input === 'object') {
        message = JSON.stringify(a.input);
      }
      let showResult = func(...a.input);
      if (typeof showResult === 'object' || isArray(showResult)) {
        showResult = JSON.stringify(func(...a.input));
      }

      test(`${funcName}: Input : ${reduceLength(
        message,
        reduce
      )} is tested for the result: ${reduceLength(showResult, reduce)}`, () => {
        if (type === 'typeof') {
          const result = func(...a.input);
          expect(typeof result).toBe(a.output);
        }
        if (type === 'single') {
          expect(func(...a.input)).toBe(a.output);
        }
        if (type === 'multiple') {
          const getResult = func(...a.input);
          if (isArray(getResult)) {
            if (inArray(a.output, getResult)) {
              expect(JSON.stringify(getResult)).toBe(JSON.stringify(getResult));
            } else {
              expect(a.output[0]).toBe(JSON.stringify(getResult));
            }
          } else if (typeof getResult === 'object') {
          expect(a.output[0]).toEqual(getResult);
          } else {
            expect(a.output).toContain(func(...a.input));
          }
        }
      });

      let count = 0;
      if (typeof a.input === 'object') {
        count = a.input.length;
      } else {
        count = 1;
      } 
      if (!checkAllOnce) {
        for (let i = 0; i < count; i++) {
          arrTestAll.forEach((fc) => {
            let changedValue = [];
            if (typeof a.input === 'object') {
              changedValue = a.input.slice();
              changedValue[i] = fc;
            } else {
              changedValue.push(fc);
            }
            let message = fc;
            if (typeof a.input === 'object') {
              message = reduceLength(JSON.stringify(fc), reduce);
            }

            if (typeof a.input === 'object') {
              message = reduceLength(JSON.stringify(fc), reduce);
            }
            let showTestAllResult = func(...changedValue);
            if (typeof showTestAllResult === 'object' || isArray(showTestAllResult)) {
              showTestAllResult = JSON.stringify(func(...changedValue));
            }
            test(`${funcName}: Value at position: ${i} is tested for the value: ${message} with the result: ${reduceLength(
              showTestAllResult,
              reduce
            )}`, () => {
              if (type === 'typeof') {
                const result = func(...changedValue);
                expect(typeof result).toBe(a.output);
              }
              if (type === 'single') {
                expect(func(...changedValue)).toBe(a.output);
              }
              if (type === 'multiple') {
                const getResult = func(...changedValue);
                if (isArray(getResult)) {
                  if (inArray(a.output, getResult)) {
                    expect(JSON.stringify(getResult)).toBe(JSON.stringify(getResult));
                  } else {
                    expect(a.output[0]).toBe(JSON.stringify(getResult));
                  }
                } else if (typeof getResult === 'object') {
                  expect(a.output).toContainEqual(getResult);
                } else {
                  expect(a.output).toContain(func(...changedValue));
                }
              }
            });
          });
         // checkAllOnce = a.input.length > 1 ? checkAllOnce : true;
         // so that it would check all values if theres more than one position
          checkAllOnce = a.input.length > 1 ? checkAllOnce : true;
        }
      }
      arrSpecificValue.forEach((ts) => {
        let message = ts.value;
        if (typeof a.input === 'object') {
          message = JSON.stringify(ts.value);
        }
        let changedValue = [];
        if (typeof a.input === 'object') {
          changedValue = a.input.slice();
        } else {
          changedValue.push(a.input);
        }
        changedValue[ts.target] = ts.value;
        let showSpecificResult = func(...changedValue);
        if (typeof showSpecificResult === 'object' || isArray(showResult)) {
          showSpecificResult = JSON.stringify(func(...changedValue));
        }
        test(`${funcName}: Value at position ${
          ts.position
        } is tested for the value ${reduceLength(
          message,
          reduce
        )} with the result ${reduceLength(showSpecificResult, reduce)}`, () => {
          if (type === 'typeof') {
            const result = func(...changedValue);
            expect(typeof result).toBe(a.output);
          }
          if (type === 'single') {
            expect(func(...changedValue)).toBe(a.output);
          }
          if (type === 'multiple') {
            const getResult = func(...changedValue);
            if (isArray(getResult)) {
              if (inArray(a.output, getResult)) {
                expect(JSON.stringify(getResult)).toBe(JSON.stringify(getResult));
              } else {
                expect(getResult).toBe(JSON.stringify(getResult));
              }
            } else if (typeof getResult === 'object') {
              expect(a.output).toContainEqual(getResult);
            } else {
              expect(a.output).toContain(func(...changedValue));
            }
          }
        });
      });
    });

  }
}
