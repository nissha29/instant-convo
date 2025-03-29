"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const JoinRoom_handler_1 = require("./handlers/JoinRoom.handler");
const ChatRoom_handler_1 = require("./handlers/ChatRoom.handler");
const CreateRoom_handler_1 = require("./handlers/CreateRoom.handler");
const disconnect_handler_1 = require("./handlers/disconnect.handler");
const messageHandlers = {
    'join': JoinRoom_handler_1.JoinRoomHandler,
    'chat': ChatRoom_handler_1.ChatRoomHandler,
    'create_room': CreateRoom_handler_1.CreateRoom,
};
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on('connection', (socket) => {
    console.log(`User connected`);
    socket.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message.toString());
            const handler = messageHandlers[parsedMessage.type];
            if (handler) {
                handler(socket, parsedMessage.payload);
            }
            else {
                console.log(`Unknown message type: ${parsedMessage.type}`);
            }
        }
        catch (error) {
            console.error('Error processing message:', error);
        }
    });
    socket.on('close', () => {
        (0, disconnect_handler_1.Disconnect)(socket);
        console.log('User disconnected');
    });
});
