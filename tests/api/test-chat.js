const dbOperations = require('../shared/db-operations');

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect;

chai.use(chaiHttp);

module.exports = function (test_data, server) {
    describe('Chat', function () {
        afterEach(function () {
            dbOperations.clearDatabase();
        });

        describe('Show all chats (same group)', () => {
            it('should get all chats for user');
            it('should not show other chats');

            it('should fail with wrong token');
            it('should fail without permission');//disabled or not activated
        });

        describe('Show a specific chat', () => {
            it('should get chat for user');
            it('should not get other chats');
            it('should get all messages');

            it('should fail with wrong token');
            it('should fail without permission');//disabled or not activated
        });

        describe('Create a new Chat', () => {
            it('should create new chat with correct name');
            it('should invite users');

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
                it('should work with bold words');
                it('should work with underlined words');
                it('should work with italic words');

                it('should work with mentions');

                it('should work with links');
                it('should contain a link preview');
            });

        });
    });
};
