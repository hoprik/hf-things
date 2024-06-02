const { createServer } = require("node:http");
const next = require("next");
const {v4} = require('uuid');
const { Server } = require("socket.io");
require('dotenv').config()

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.APP_IP || "localhost";
const port = process.env.APP_PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let mass:any[] = []

function isInMass(element:any, index:any, array:any, uuid:any) {
    return element[0] === uuid
}

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);


    io.on('connection', (socket:any) => {
        socket.on("work",async(token:any)=>{
            socket.emit("work", token.toUpperCase())
        })

        socket.on("qrGet",async(token:any)=>{
            const uuid = v4();
            mass.push([uuid, socket])
            socket.emit("qrGet", uuid)
        })

        socket.on("qrPost",async(uuid:any)=>{
            const answer = mass.find((element, index, array)=> isInMass(element, index, array, uuid))
            if (answer === undefined){
                socket.emit("qrPost", "false")
            }
            else{
                const qr = answer[1]
                qr.emit("qrPost", "Авторизован")
                socket.emit("qrPost", "true")
            }

        })

    });

    httpServer
        .once("error", (err:any) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Запутстил на http://${hostname}:${port}`);
        });
});