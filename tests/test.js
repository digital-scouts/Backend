const dbOperations = require('./shared/db-operations');
const dependencies = require("./shared/dependencies");

const testFilesToRun = [
"./api/test-user.js"
];

describe('Backend test suite', () => {
    it('it should run all backend tests', (done) => {
        dbOperations.clearDatabase()
            .then(executeTests)
            .then(done);
    });
});

function executeTests() {
    testFilesToRun.forEach(function(path) {
        let test = require(path);
        test(dependencies);
    });
}
