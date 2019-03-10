const dbOperations = require('../shared/db-operations');

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect;

chai.use(chaiHttp);

module.exports = function (test_data, server) {


    /**
     * create a chat with the user
     * @param token
     * @param name
     * @return {Promise} with 'chatID'
     */
    function prepareChat(token, name) {
        let chatID;

        chai.request(server)
            .post('/api/chat')
            .send({token: token, chatName: name})
            .end((err, res) => {
                chatID = res.body._id;
            });

        return new Promise(resolve => {
            function checkFlag() {
                if (chatID) {
                    resolve({chatID: chatID});
                } else {
                    setTimeout(checkFlag, 100);
                }
            }

            checkFlag();
        });
    }

    /**
     * create users and chats
     * @return {Promise} with  'woeId', 'woeToken', 'woeChatId', 'jufiId', 'jufiToken', 'jufiChatId'
     */
    function createUserChats() {
        let woeChatId;
        let jufiChatId;
        let woeId;
        let jufiId;
        let woeToken;
        let jufiToken;
        dbOperations.prepareUser(test_data.users[0], server).then((uRes) => {
            woeId = uRes.id;
            woeToken = uRes.token;
            prepareChat(uRes.token, 'Woe Chat').then((cRes) => {
                woeChatId = cRes.chatID;
            });
        });

        dbOperations.prepareUser(test_data.users[1], server).then((uRes) => {
            jufiId = uRes.id;
            jufiToken = uRes.token;
            prepareChat(uRes.token, 'Jufi Chat').then((cRes) => {
                jufiChatId = cRes.chatID;
            });
        });

        return new Promise(resolve => {
            function checkFlag() {
                if (woeChatId && jufiChatId) {
                    resolve({
                        woeId: woeId,
                        woeToken: woeToken,
                        woeChatId: woeChatId,
                        jufiId: jufiId,
                        jufiToken: jufiToken,
                        jufiChatId: jufiChatId
                    });
                } else {
                    setTimeout(checkFlag, 100);
                }
            }

            checkFlag();
        });
    }


    describe('Chat', function () {
        afterEach(function (done) {
            dbOperations.clearDatabase().then(() => {
                done();
            });
        });

        describe('Create a new Chat', () => {
            it('should create new chat with correct name', (done) => {
                dbOperations.prepareUser(test_data.users[0], server).then(uRes => {
                    chai.request(server)
                        .post('/api/chat')
                        .send({token: uRes.token, chatName: 'name'})
                        .end((err, res) => {
                            expect(res.body.roomName).to.equal('name');
                            done();
                        });
                });
            });

            it('should invite users', (done) => {
                dbOperations.prepareUser(test_data.users[0], server).then(uRes1 => {
                    dbOperations.prepareUser(test_data.users[3], server).then(uRes2 => {
                        chai.request(server)
                            .post('/api/chat')
                            .send({token: uRes1.token, chatName: 'Chat with 2 members', member: [uRes2.id]})
                            .end((err, res) => {
                                expect(res.body.user).to.include.members([uRes1.id, uRes2.id]);
                                done();
                            });
                    });
                });
            });

            it('should only invite users from same group', (done) => {
                dbOperations.prepareUser(test_data.users[0], server).then(uRes1 => {
                    dbOperations.prepareUser(test_data.users[1], server).then(uRes2 => {
                        chai.request(server)
                            .post('/api/chat')
                            .send({token: uRes1.token, chatName: 'name', member: [uRes2.id]})
                            .end((err, res) => {
                                expect(res.body.user).to.not.include.members([uRes2.id]);
                                done();
                            });
                    });
                });
            });

            it('should fail with wrong token', (done) => {
                dbOperations.prepareUser(test_data.users[0], server).then(uRes1 => {
                    chai.request(server)
                        .post('/api/chat')
                        .send({token: uRes1.token + 'x', chatName: 'name'})
                        .end((err, res) => {
                            expect(res).to.have.status(401);
                            done();
                        });
                });
            });

            it('should fail without permission', (done) => {
                dbOperations.prepareUser(test_data.users[0], server).then(async uRes => {
                    await dbOperations.disableUser(uRes.id, server);
                    chai.request(server)
                        .get('/api/chat')
                        .send({token: uRes.token})
                        .end((err, res) => {
                            expect(res).to.have.status(403);
                            done();
                        });
                });
            });//disabled or not activated

            it('should fail when not activated', (done) => {
                let user = test_data.users[0];
                dbOperations.prepareUser(user, server).then(async res => {
                    await dbOperations.deactivateUser(res.id, server);
                    chai.request(server)
                        .post('/api/chat')
                        .send({token: res.token, name: 'name'})
                        .end((err, res) => { //create chat with a not activated user
                            expect(res).to.have.status(403);
                            done();
                        });
                });
            });
        });

        describe('Show all chats (same group)', () => {

            it('should get all chats for user', (done) => {

                createUserChats().then(uRes => {
                    chai.request(server)
                        .get('/api/chat')
                        .send({token: uRes.woeToken})
                        .end((err, res) => {
                            expect(res.body[0].user[0]).to.equal(uRes.woeId);
                            expect(res.body.length).to.equal(1);

                            done();
                        });
                });
            });

            it('should fail with wrong token', (done) => {
                createUserChats().then(uRes => {
                    chai.request(server)
                        .get('/api/chat')
                        .send({token: 'token'})
                        .end((err, res) => {
                            expect(res).to.have.status(401);
                            done();
                        });
                });
            });

            it('should fail without permission', (done) => {
                createUserChats().then(async uRes => {
                    await dbOperations.disableUser(uRes.woeId, server);
                    chai.request(server)
                        .get('/api/chat')
                        .send({token: uRes.woeToken})
                        .end((err, res) => {
                            expect(res).to.have.status(403);
                            done();
                        });
                });
            });

            it('should fail when not activated', (done) => {
                let user = test_data.users[0];
                dbOperations.prepareUser(user, server).then(async res => {
                    await dbOperations.deactivateUser(res.id, server);
                    chai.request(server)
                        .get('/api/chat')
                        .send({token: res.token})
                        .end((err, res) => { //create chat with a not activated user
                            expect(res).to.have.status(403);
                            done();
                        });
                });
            });
        });

        describe('Show a specific chat', () => {
            it('should get chat for user');
            it('should not get other chats');
            it('should get all messages');

            it('should fail with wrong token');
            it('should fail without permission');//disabled or not activated
        });

        describe('Send a message', () => {
            describe('Send a text message', () => {
                it('should send a message and save it to database with correct data');
                it('should send a message and notify active clients');
                it('should fail chat did not exist');
                it('should fail when not member of chat');
                it('should fail with wrong token');
                it('should fail without permission');//disabled or not activated
            });

            describe('with extra data', () => {
                it('should send the message later with sendTime');
                it('should send the message now with no sendTime');

                it('should delete the message later with deleteTime');

                it('should not send a push message to other clients with silentMessage');

                it('should send a new message to a answer with answerToId');
                it('should link to answered message answerToId');

                it('should update the received message with editedNewID');
                it('should show message history with editedNewID');
                it('should notify the client to update the chat when editedNewID');

                it('should send a forwarded message forwardedID');
                it('should be a anonymous name with forwardedID');
            });

            describe('encoding', () => {
                it('should be a encoded message');
            });

            describe('formatting', () => {
                it('should work with mentions');

                it('should work with links');
                it('should contain a link preview');
            });
        });
    });


};
