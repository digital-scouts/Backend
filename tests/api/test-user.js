const app = require('../../expressApp').default,
    server = app.server;

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should();

chai.use(chaiHttp);
const userController = require('../../controller/userController');
const userModel = require('./../../models/chatModel').Chat;

module.exports = function (test_data) {
    describe('Users', function () {
        describe('/POST user', () => {
            it('should post a new user with minimal correct data', (done) => {
                chai.request(server)
                    .post('/api/users')
                    .query(test_data.users[0])
                    .end(async (err, res) => {
                        res.should.have.status(200);

                        let dbRequest = await userModel.findById(res._id).exec();
                        should.exist(dbRequest);

                        done();
                    });
                done();
            });

            it('should post a new user with maximal correct data', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with wrong email', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail without email', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with already existing email', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail without name_first', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail without name_last', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail without role', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail without password', (done) => {
                notRready.should(wrong);
                done();
            });
        });

        describe('/GET users', () => {
            it('should get all users in the same group', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with missing permission', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with wrong token', (done) => {
                notRready.should(wrong);
                done();
            });
        });

        describe('/PUT user', () => {
            it('should update a user', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with wrong id', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with missing permission', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with wrong token', (done) => {
                notRready.should(wrong);
                done();
            });
        });

        describe('/PUT user-image', () => {
            it('should update a user image', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with wrong id', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with missing permission', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with wrong token', (done) => {
                notRready.should(wrong);
                done();
            });
        });

        describe('/PUT user-password', () => {
            it('should update a user password', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with wrong id', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with missing permission', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with wrong token', (done) => {
                notRready.should(wrong);
                done();
            });
        });

        describe('/PUT user-email', () => {
            it('should update a user email', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with wrong id', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with missing permission', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with wrong token', (done) => {
                notRready.should(wrong);
                done();
            });
        });

    });

};
