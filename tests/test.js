const dbOperations = require('./shared/db-operations');

const testFilesToRun = [
"./api/test-user.js"
];

describe('Backend test suite', () => {
    it('it should run all backend tests', (done) => {
        dbOperations.clearDatabase()
            .then(executeTests)
            .then(done);
    }).timeout(5000);
});

function executeTests() {

    testFilesToRun.forEach(function(path) {
        let test = require(path);
        test();
    });
}
