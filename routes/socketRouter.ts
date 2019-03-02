//https://socket.io/docs/server-api/

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
            console.log('a user connected');

            socket.on('auth', (token) => {
                //todo check token and save socket in db
            });

            /**
             * todo
             * receives messages and handel them
             * @param chatID - uniq chat identifier
             * @param message - message to send
             * @param params - some params for this message
             */
            socket.on('sendMessage', (chatID, message, params)=>{
                //todo check if receiver is online -> send message
                //todo store message in db
            });

            /**
             * todo
             * edit existing messages
             * @param chatID - uniq chat identifier
             * @param messageID - uniq message identifier
             * @param message - message to send
             * @param params - some params for this message
             */
            socket.on('editMessage', (chatID, messageID, message, params)=>{
                //todo validate user
                //todo search old message, set edited flag, and a source to new message
                //todo save edited message as new message
            });



            socket.on('disconnecting', (reason) => {
                //todo
            });

            socket.on('disconnect', function (reason) {
                //todo delete socketId in db
                console.log('a user disconnected');
            });

            socket.on('error', function (error) {
                //todo what can happen here?
                console.log('Woops an error');
                console.error(error);
            });
        });
    }
}
