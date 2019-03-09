const dbOperations = require('../shared/db-operations');

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect;

chai.use(chaiHttp);

module.exports = function (test_data, server) {
    describe('Admin-Account', function () {
        afterEach(function () {
            dbOperations.clearDatabase();
        });

        describe('/GET users', function () {
            it('should fail if user is not a admin');
            it('should get all users from all groups');
        });

        describe('/GET user', function () {
            it('should fail if user is not a admin');
            it('should get the correct user');
        });

        describe('/DELETE:id user', function () {
            it('should fail if user is not a admin');
            it('should delete the correct user');
        });

        describe('/GET notActivated', function () {
            it('should fail if user is not a admin');
            it('should get all not activated users');
            it('shouldn\'t show activated users');
        });

        describe('/PUT:id notActivated', function () {
            it('should fail if user is not a admin');
            it('should update the activation status');
        });

        describe('/GET disabled', function () {
            it('should fail if user is not a admin');
            it('should get all disabled users');
            it('shouldn\'t show not disabled users');
        });

        describe('/PUT:id disabled', function () {
            it('should fail if user is not a admin');
            it('should update the disabled status');
        });

        describe('/GET inactive', function () {
            it('should fail if user is not a admin');
            it('should get all inactive users');
            it('shouldn\'t show not inactive users');
        });
    });
};
