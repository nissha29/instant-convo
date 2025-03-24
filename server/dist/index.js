"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const clientRooms = new Map();
wss.on('connection', (socket) => {
    console.log(`User connected`);
    socket.on('message', (message) => {
        var _a, _b;
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.type == 'join') {
            const roomId = parsedMessage.payload.roomId;
            if (clientRooms.has(roomId)) {
                (_a = clientRooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.push(socket);
            }
            else {
                clientRooms.set(roomId, [socket]);
            }
        }
        else if (parsedMessage.type == 'chat') {
            {
                let currentUserRoom = null;
                clientRooms.forEach((sockets, roomId) => {
                    if (sockets.includes(socket)) {
                        currentUserRoom = roomId;
                    }
                });
                if (currentUserRoom) {
                    const receivedMessage = (_b = parsedMessage === null || parsedMessage === void 0 ? void 0 : parsedMessage.payload) === null || _b === void 0 ? void 0 : _b.message;
                    const socketsInCurrentRoom = clientRooms.get(currentUserRoom);
                    socketsInCurrentRoom === null || socketsInCurrentRoom === void 0 ? void 0 : socketsInCurrentRoom.forEach((client) => {
                        client.send(receivedMessage);
                    });
                }
                else {
                    console.log(`${currentUserRoom} Room does not exist`);
                }
            }
        }
    });
});
