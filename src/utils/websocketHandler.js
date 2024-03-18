import { createServer } from "http";
import { Server } from "socket.io";
import { app } from "../app.js";

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
   console.log(socket, "socket");
});

export { httpServer };
