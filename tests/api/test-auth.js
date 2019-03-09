const dbOperations = require('../shared/db-operations');

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect;

chai.use(chaiHttp);

module.exports = function (test_data, server) {
    describe('Auth', function () {
        afterEach(function () {
            dbOperations.clearDatabase();
        });

        it('should login with correct data', (done) => {
            chai.request(server)
                .post('/api/users')
                .send(test_data.users[1])
                .end((err, res) => { //create a user
                    expect(res).to.have.status(200);
                    chai.request(server)
                        .post('/api/auth')
                        .send({
                            email: test_data.users[1].email,
                            password: test_data.users[1].password
                        })
                        .end((err, res) => { //login
                            expect(res).to.have.status(200);
                            //todo check if token provides correct userData
                            done();
                        });
                });

        });

        it('should fail with incorrect email', (done) => {
            chai.request(server)
                .post('/api/users')
                .send(test_data.users[1])
                .end((err, res) => { //create user
                    expect(res).to.have.status(200);
                    chai.request(server)
                        .post('/api/auth')
                        .send({
                            email: 'fail@mail.de',
                            password: test_data.users[1].password
                        })
                        .end((err, res) => { //login with wrong email
                            expect(res).to.have.status(401);
                            done();
                        });
                });
        });

        it('should fail with incorrect password', (done) => {
            chai.request(server)
                .post('/api/users')
                .send(test_data.users[1])
                .end((err, res) => { //create user
                    expect(res).to.have.status(200);
                    chai.request(server)
                        .post('/api/auth')
                        .send({
                            email: test_data.users[1].email,
                            password: 'WhoopsWrongPassword'
                        })
                        .end((err, res) => { //login with wrong password
                            expect(res).to.have.status(401);
                            done();
                        });
                });
        });

    });
};
