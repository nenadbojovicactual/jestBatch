//****************************** */jestHelper v1.00*************************************
function isArray(obj) {
    return !!obj && obj.constructor === Array;
  }
module.exports = function jestHelper(expected, testAll, specificValue, func, funcName)
{
  
// parametars used:     
// expected: object or an array of objects with properties input which holds an array of values used in the function, and output. Example of object: : { input:[1,2], output: 3};
// testAll: single value or an array of values to test against the function with the expected values
// specificValue: is an object or an array of object with properties: value and position. Example of object: { position:1, value: 2};
// func: function to be tested
// funcName: is a function name or description
let arrExpected = [];
let arrTestAll = [];
let arrSpecificValue = [];
if (!isArray(expected)) {
    arrExpected.push(expected);
}
else {
    arrExpected= expected.slice();
}
if (!isArray(testAll)) {
    arrTestAll.push(testAll);
}
else {
    arrTestAll = testAll.slice();
}
if (!isArray(specificValue)) {
    arrSpecificValue.push(specificValue);
}
else {
    arrSpecificValue = specificValue.slice();
}
 let check =true;

arrExpected.forEach((exp)=>
{

   if (!exp.hasOwnProperty('input') || !exp.hasOwnProperty('output')) {
   check= false;      console.log("Expected value is not in a correct format.");   
   }
});
arrSpecificValue.forEach((exp)=>
{

   if (!exp.hasOwnProperty('position') || !exp.hasOwnProperty('value')) {
   check= false;   console.log("Specific value is not in a correct format.");    
   }
});
if(func instanceof Function === false){
    check= false;
    console.log("You have not supplied a function");
 }
if (check) {
arrExpected.forEach((a)=> {
    test(funcName, () => {
    expect(func(...a.input)).toBe(a.output); });
 
    const count = a.input.length;  
    for (let i=0;i<count;i++)
    { 
    arrTestAll.forEach((fc) => {
        let changedValue = a.input.slice();
       changedValue[i]= fc;
    test(funcName +": Value at position: " + i +" is tested for the value: " + fc, () => {
  
        expect(func(...changedValue)).toBe(a.output);});

      });
   
    };
       arrSpecificValue.forEach((ts) => {
        test(`${funcName}: Value at position ${ts.position} is tested for the value ${ts.value}`, () => {
            let changedValue = a.input.slice();
            changedValue[ts.target]= ts.value;
            expect(func(...changedValue)).toBe(a.output); })
    
          }); 
});
}}