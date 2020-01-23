var Test = /** @class */ (function () {
    function Test(testId) {
        this.testId = testId;
    }
    Test.prototype.runTest = function (d) {
        console.log('Data[' + this.testId + ']:', d);
    };
    ;
    return Test;
}());
var t1 = new Test('proba');
t1.runTest({ id: '1' });
