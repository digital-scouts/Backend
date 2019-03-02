//https://socket.io/docs/server-api/

export class SocketRouter {
    private ioServer;

    public constructor(ioServer) {
        this.ioServer = ioServer;
        this.initCalls();

        console.log("Socket setup finished...");
    }

    private initCalls() {
        this.ioServer.on('connection', function (socket) {
            console.log('a user connected');

            socket.on('disconnecting', (reason) => {
                //todo
            });

            socket.on('disconnect', function (reason) {
                //todo
                console.log('a user disconnected');
            });

            socket.on('error', function (error) {
                //todo
                console.log('Woops an error');
            });
        });
    }
}
