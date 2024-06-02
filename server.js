const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");
require('dotenv').config()

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.APP_IP || "localhost";
const port = process.env.APP_PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);


    io.on('connection', (socket) => {
        socket.on("work",async(token)=>{
            socket.emit("work", token.toUpperCase())
        })
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Запутстил на http://${hostname}:${port}`);
        });
});