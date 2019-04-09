const server = require('../expressApp').appE;
const dbOperations = require('./shared/db-operations');
const test_data = require('./shared/test-data');
const testFilesToRun = [
    './api/test-user.js',
    './api/test-auth.js',
    './api/test-chat.js',
    './api/test-admin-account.js',
    './api/test-calendar.js',
    './api/test-group.js',

];

describe('Backend test suite', () => {
    it('connect to node and mongo', (done) => {
        dbOperations.clearDatabase()
            .then(done);
        testFilesToRun.forEach(function (path) {
            let test = require(path);
            test(test_data, server);
        });
    }).timeout(3000);
});
