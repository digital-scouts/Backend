const app = require('../../expressApp'),
    server = app.serverE;

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect;

chai.use(chaiHttp);
const userController = require('../../controller/userController');
const userModel = require('./../../models/chatModel').Chat;

module.exports = function (test_data) {
    describe('Users', function () {

        describe('/POST user', () => {
            it('should post a new user with minimal correct data', (done) => {
                chai.request(server)
                    .post('/api/users')
                    .send(test_data.users[0])
                    .end(async (err, res) => {
                        test_data.users[0].id = res._id;
                        console.log("ID: " + res._id)
                        expect(res).to.have.status(200);
                    });
                done();
            });

            it.skip('user should exist after post', (done)=>{
                let dbRequest = userModel.findById(res._id).exec();
                should.exist(dbRequest);
                done();
            });

            it('should post a new user with maximal correct data');

            it('should fail with wrong email');

            it('should fail without email');

            it('should fail with already existing email');

            it('should fail without name_first');

            it('should fail without name_last');

            it('should fail without role');

            it('should fail without password');
        });

        describe('/GET users', () => {
            it('should get all users in the same group');

            it('should fail with missing permission');

            it('should fail with wrong token');
        });

        describe('/PUT user', () => {
            it('should update a user');

            it('should fail with wrong id');

            it('should fail with missing permission');

            it('should fail with wrong token');
        });

        describe('/PUT user-image', () => {
            it('should update a user image');

            it('should fail with wrong id');

            it('should fail with missing permission');

            it('should fail with wrong token');
        });

        describe('/PUT user-password', () => {
            it('should update a user password');

            it('should fail with wrong id');

            it('should fail with missing permission');

            it('should fail with wrong token');
        });

        describe('/PUT user-email', () => {
            it('should update a user email');

            it('should fail with wrong id');

            it('should fail with missing permission');

            it('should fail with wrong token');
        });

    });

};
