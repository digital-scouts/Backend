const app = require('../../expressApp'),
    server = app.serverE;

const dnOperations = require('../shared/db-operations');

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect;

chai.use(chaiHttp);
const userController = require('../../controller/userController');
const userModel = require('./../../models/chatModel').Chat;

module.exports = function (test_data) {
    describe('Users', function () {
        afterEach(function () {
            dnOperations.clearDatabase();
        });

        describe('/POST user', () => {
            it('should post a new user with minimal correct data', (done) => {
                chai.request(server)
                    .post('/api/users')
                    .send(test_data.users[0])
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        done();
                    });
            });

            it('should post a new user with maximal correct data',(done)=>{
                chai.request(server)
                    .post('/api/users')
                    .send(test_data.users[1])
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        done();
                    });
            });

            describe('test wrong emails', ()=>{
                test_data.wrong_data.email.forEach( (wrong_email) => {
                    it('should fail with wrong email ('+wrong_email+')', (done) => {
                         chai.request(server)
                            .post('/api/users')
                            .send({//test user with minimal data
                                name_first: "Test User",
                                name_last: "Minimal Data",
                                email: wrong_email,
                                password: "1234sad??dd.S",
                                role: "woe",
                            })
                            .end((err, res) => {
                                expect(res).to.have.status(422);
                                done();
                            });
                    });
                });
            });

            it('should fail without email', (done) =>{
                chai.request(server)
                    .post('/api/users')
                    .send({//test user with minimal data
                        name_first: "Test User",
                        name_last: "without email",
                        password: "1234sad??dd.S",
                        role: "woe",
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(422);
                        done();
                    });
            });

            it('should fail with already existing email', (done)=>{
                chai.request(server)
                    .post('/api/users')
                    .send(test_data.users[1])
                    .end((err, res) =>{
                        expect(res).to.have.status(200);
                        chai.request(server)
                            .post('/api/users')
                            .send(test_data.users[1])
                            .end((err, res) => {
                                expect(res).to.have.status(403);
                                done();
                            });
                    });
            });

            it('should fail without name_first',(done)=>{
                chai.request(server)
                    .post('/api/users')
                    .send({//test user with minimal data
                        name_last: "without name_first",
                        email: "correct@email.de",
                        password: "1234sad??dd.S",
                        role: "woe",
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(422);
                        done();
                    });
            });

            it('should fail without name_last', (done)=>{
                chai.request(server)
                    .post('/api/users')
                    .send({//test user with minimal data
                        name_first: "without name_last",
                        email: "correct@email.de",
                        password: "1234sad??dd.S",
                        role: "woe",
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(422);
                        done();
                    });
            });

            it('should fail without role',(done)=>{
                chai.request(server)
                    .post('/api/users')
                    .send({//test user with minimal data
                        name_first: "test user",
                        name_last:"without role",
                        email: "correct@email.de",
                        password: "1234sad??dd.S",
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(422);
                        done();
                    });
            });

            it('should fail with wrong role',(done)=>{
                chai.request(server)
                    .post('/api/users')
                    .send({//test user with minimal data
                        name_first: "test user",
                        name_last:"without role",
                        email: "correct@email.de",
                        password: "1234sad??dd.S",
                        role:"bauer"
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(422);
                        done();
                    });
            });

            it('should fail without password',(done)=>{
                chai.request(server)
                    .post('/api/users')
                    .send({//test user with minimal data
                        name_first: "test user",
                        name_last:"without role",
                        email: "correct@email.de",
                        role:"woe"
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(422);
                        done();
                    });
            });

            describe('test unsafe passwords', ()=>{
                test_data.wrong_data.password.forEach( (password, index) => {
                    it('should fail with unsafe password ('+password+')', (done) => {
                        chai.request(server)
                            .post('/api/users')
                            .send({//test user with minimal data
                                name_first: "Test User",
                                name_last: "Minimal Data",
                                email: index+"@mail.de",
                                password: password,
                                role: "woe",
                            })
                            .end((err, res) => {
                                expect(res).to.have.status(422);
                                done();
                            });
                    });
                });
            });
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
