interface TestData {
    id: string;
    name?: string;
}

class Test {
    runTest(d: TestData) {
        console.log('Data[' + this.testId + ']:', d);
    }

    constructor(private testId: string) {};
}


const t1 = new Test('proba2');
t1.runTest({id: '2'});
