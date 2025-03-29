import { WebSocketServer, WebSocket } from 'ws';
import { JoinRoomHandler } from './handlers/JoinRoom.handler'
import { ChatRoomHandler } from './handlers/ChatRoom.handler';
import { CreateRoom } from './handlers/CreateRoom.handler';
import { Disconnect } from './handlers/disconnect.handler';

interface Message {
    type: string,
    payload: any,
}

type MessageType = 'join' | 'chat' | 'create_room';


const messageHandlers: Record<MessageType, (socket: WebSocket, payload: any) => void> = {
    'join': JoinRoomHandler,
    'chat': ChatRoomHandler,
    'create_room': CreateRoom,
};


const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (socket) => {
    console.log(`User connected`);
    
    socket.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString()) as Message;
        const handler = messageHandlers[parsedMessage.type as MessageType];
        
        if (handler) {
          handler(socket, parsedMessage.payload);
        } else {
          console.log(`Unknown message type: ${parsedMessage.type}`);
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });
    
    socket.on('close', () => {
      Disconnect(socket);
      console.log('User disconnected');
    });
  });