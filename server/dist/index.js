"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const dotenv_1 = __importDefault(require("dotenv"));
const JoinRoom_handler_1 = require("./handlers/JoinRoom.handler");
const ChatRoom_handler_1 = require("./handlers/ChatRoom.handler");
const CreateRoom_handler_1 = require("./handlers/CreateRoom.handler");
const disconnect_handler_1 = require("./handlers/disconnect.handler");
dotenv_1.default.config();
const messageHandlers = {
    'join': JoinRoom_handler_1.JoinRoomHandler,
    'chat': ChatRoom_handler_1.ChatRoomHandler,
    'create_room': CreateRoom_handler_1.CreateRoom,
};
const wss = new ws_1.WebSocketServer({ port: ((_a = process.env) === null || _a === void 0 ? void 0 : _a.PORT) ? Number(process.env.PORT) : 3000 });
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
