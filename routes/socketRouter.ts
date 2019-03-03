//https://socket.io/docs/server-api/

import {SocketController} from '../controller/socketController';

export class SocketRouter {
    private ioServer;

    public constructor(ioServer) {
        this.ioServer = ioServer;
        this.initCalls();

        console.log("Socket setup finished...");
    }

    /**
     *
     *
     */
    private initCalls() {
        this.ioServer.on('connection', function (socket) {

            //user is unknown
            console.log('SOCKET: a user connected');

            socket.on('auth', (token) => {
                console.log("token: " + token)
                console.log("socket: " + socket.id)
               SocketController.handleAuth(socket, token);
            });

            /**
             * @author lange
             * @since 2019-03-02
             * receives messages and handel them
             * @param {string} chatID - uniq chat identifier
             * @param {string} message - message to send
             * @param data - some params for this message
             */
            socket.on('sendMessage', (chatID: string, messageType: string, data) => {
              SocketController.handleNewMessage(socket, chatID, messageType, data);
            });

            /**
             * @author lange
             * @since 2019-03-02
             * todo
             * edit existing text messages
             * @param {string}  chatID - uniq chat identifier
             * @param {string} messageID{string} - uniq message identifier
             * @param data - message with meta data to send
             */
            socket.on('editMessage', (chatID: string, messageID: string, data) => {
                //todo validate user
                //todo search old message, set edited flag, and a source to new message
                //todo save edited message as new message
                console.log('SOCKET: editMessage');
            });

            /**
             * @author lange
             * @since 2019-03-02
             * todo
             * @param {string} messageID{string} - uniq message identifier
             */
            socket.on('deleteMessage', (messageID: string) => {

            });

            socket.on('disconnecting', (reason) => {
                //todo
                console.log('SOCKET: a user disconnecting');
            });

            socket.on('disconnect', function (reason) {
                SocketController.handleDisconnect(socket);
                console.log('SOCKET: a user disconnected');
            });

            socket.on('error', function (error) {
                //todo what can happen here?
                console.log('SOCKET: Woops an error');
                console.error(error);
            });
        });
    }
}
