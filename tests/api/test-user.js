const dbOperations = require('../shared/db-operations');

const chai = require('chai'),
    expect = chai.expect;

chai.use(require('chai-things'));
chai.use(require('chai-http'));

module.exports = function (test_data, server) {
    describe('Users', function () {
        afterEach(function () {
            dbOperations.clearDatabase();
        });

        describe('Create a new User', () => {
            it('should post a new user with minimal correct data', (done) => {
                chai.request(server)
                    .post('/api/users')
                    .send(test_data.users[0])
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        done();
                    });
            });

            it('should post a new user with maximal correct data', (done) => {
                chai.request(server)
                    .post('/api/users')
                    .send(test_data.users[1])
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        done();
                    });
            });

            describe('test wrong emails', () => {
                test_data.wrong_data.email.forEach((wrong_email) => {
                    it('should fail with wrong email (' + wrong_email + ')', (done) => {
                        chai.request(server)
                            .post('/api/users')
                            .send({//test user with minimal data
                                name_first: 'Test User',
                                name_last: 'Minimal Data',
                                email: wrong_email,
                                password: '1234sad??dd.S',
                                role: 'woe'
                            })
                            .end((err, res) => {
                                expect(res).to.have.status(422);
                                done();
                            });
                    });
                });
            });

            it('should fail without email', (done) => {
                chai.request(server)
                    .post('/api/users')
                    .send({//test user with minimal data
                        name_first: 'Test User',
                        name_last: 'without email',
                        password: '1234sad??dd.S',
                        role: 'woe'
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(422);
                        done();
                    });
            });

            it('should fail with already existing email', (done) => {
                chai.request(server)
                    .post('/api/users')
                    .send(test_data.users[1])
                    .end((err, res) => {
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

            it('should fail without name_first', (done) => {
                chai.request(server)
                    .post('/api/users')
                    .send({//test user with minimal data
                        name_last: 'without name_first',
                        email: 'correct@email.de',
                        password: '1234sad??dd.S',
                        role: 'woe'
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(422);
                        done();
                    });
            });

            it('should fail without name_last', (done) => {
                chai.request(server)
                    .post('/api/users')
                    .send({//test user with minimal data
                        name_first: 'without name_last',
                        email: 'correct@email.de',
                        password: '1234sad??dd.S',
                        role: 'woe'
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(422);
                        done();
                    });
            });

            it('should fail without role', (done) => {
                chai.request(server)
                    .post('/api/users')
                    .send({//test user with minimal data
                        name_first: 'test user',
                        name_last: 'without role',
                        email: 'correct@email.de',
                        password: '1234sad??dd.S'
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(422);
                        done();
                    });
            });

            it('should fail with wrong role', (done) => {
                chai.request(server)
                    .post('/api/users')
                    .send({//test user with minimal data
                        name_first: 'test user',
                        name_last: 'without role',
                        email: 'correct@email.de',
                        password: '1234sad??dd.S',
                        role: 'bauer'
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(422);
                        done();
                    });
            });

            it('should fail without password', (done) => {
                chai.request(server)
                    .post('/api/users')
                    .send({//test user with minimal data
                        name_first: 'test user',
                        name_last: 'without role',
                        email: 'correct@email.de',
                        role: 'woe'
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(422);
                        done();
                    });
            });

            describe('test unsafe passwords', () => {
                test_data.wrong_data.password.forEach((password, index) => {
                    it('should fail with unsafe password (' + password + ')', (done) => {
                        chai.request(server)
                            .post('/api/users')
                            .send({//test user with minimal data
                                name_first: 'Test User',
                                name_last: 'Minimal Data',
                                email: index + '@mail.de',
                                password: password,
                                role: 'woe'
                            })
                            .end((err, res) => {
                                expect(res).to.have.status(422);
                                done();
                            });
                    });
                });
            });
        });

        describe('Show all users (with same group)', () => {

            it('should get all users in the same group', (done) => {
                dbOperations.prepareUser(test_data.users[0], server).then(woeRes => {
                    dbOperations.prepareUser(test_data.users[1], server).then(jufiRes => {
                        chai.request(server)
                            .get('/api/users')
                            .send({token: woeRes.token})
                            .end((err, res) => { //get all with woe token
                                expect(res.body).all.have.property('_id', woeRes.id);
                                expect(res.body.length).to.equal(1, 'Created only one \'woe\'. \'jufi\' should be hidden.');
                                done();
                            });
                    });
                });
            });

            it('should fail with missing permission', (done) => {
                let tempServer = server;
                dbOperations.prepareUser(test_data.users[0], server).then(async (res) => {
                    await dbOperations.activateUser(res.id, tempServer);
                    await dbOperations.disableUser(res.id, tempServer);
                    chai.request(server)
                        .get('/api/users')
                        .send({token: res.token})
                        .end((err, res) => { //get all with woe token
                            expect(res).to.have.status(403);
                            done();
                        });
                });
            });

            it('should fail as not activated user', (done) => {
                dbOperations.prepareUser(test_data.users[0], server).then(async (res) => {
                    await dbOperations.deactivateUser(res.id);
                    chai.request(server)
                        .get('/api/users')
                        .send({token: res.token})
                        .end((err, res) => { //get all with woe token
                            expect(res).to.have.status(403);
                            done();
                        });
                });
            });

            it('should fail with wrong token', (done) => {
                chai.request(server)
                    .get('/api/users')
                    .send({token: ''})
                    .end((err, res) => { //get all with woe token
                        expect(res).to.have.status(401);
                        done();
                    });
            });
        });

        describe('Update other information\'s', () => {
            it('should update a user');

            it('should fail with missing permission');

            it('should fail with wrong token');
        });

        describe('Update Profile image', () => {
            it('should update a user image');

            it('should fail with wrong id');

            it('should fail with wrong token');
        });

        describe('Update Password', () => {
            it('should update a user password', (done) => {
                let newPassword = 'SaveNewPassword213!';
                dbOperations.prepareUser(test_data.users[1], server).then(res => {
                    chai.request(server)
                        .put('/api/users/password')
                        .send({
                            token: res.token,
                            oldPassword: test_data.users[1].password,
                            password: newPassword
                        })
                        .end((err, res) => { //get all with woe token
                            expect(res).to.have.status(200);
                            expect(res.body.password).to.equal(newPassword);
                            done();
                        });
                });
            });

            it('should fail with wrong old password', (done) => {
                dbOperations.prepareUser(test_data.users[1], server).then(res => {
                    chai.request(server)
                        .put('/api/users/password')
                        .send({
                            token: res.token,
                            oldPassword: test_data.users[1].password + 'wrong',
                            password: 'newPasswordNotNecessary'
                        })
                        .end((err, res) => { //get all with woe token
                            expect(res).to.have.status(422);
                            done();
                        });
                });
            });

            it('should fail with wrong token', (done) => {
                dbOperations.prepareUser(test_data.users[1], server).then(res => {
                    chai.request(server)
                        .put('/api/users/password')
                        .send({
                            token: res.token + 'x', //wrong token
                            oldPassword: test_data.users[1].password,
                            password: 'newPasswordNotNecessary'
                        })
                        .end((err, res) => { //get all with woe token
                            expect(res).to.have.status(401);
                            done();
                        });
                });
            });
        });

        describe('Update E-Mail', () => {
            it('should update a user email', (done) => {
                dbOperations.prepareUser(test_data.users[1], server).then(res => {
                    let newMail = 'new@mail.com';
                    chai.request(server)
                        .put('/api/users/email')
                        .send({
                            token: res.token,
                            email: newMail
                        })
                        .end((err, res) => { //get all with woe token
                            expect(res).to.have.status(200);
                            expect(res.body.email).to.equal(newMail);
                            done();
                        });
                });
            });

            it('should fail with wrong token', (done) => {
                dbOperations.prepareUser(test_data.users[1], server).then(res => {
                    chai.request(server)
                        .put('/api/users/email')
                        .send({
                            token: res.token + 'x', //wrong token
                            email: 'new@mail.com'
                        })
                        .end((err, res) => { //get all with woe token
                            expect(res).to.have.status(401);
                            done();
                        });
                });
            });
        });
    });

};
