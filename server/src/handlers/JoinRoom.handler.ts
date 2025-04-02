import { WebSocket } from "ws"
import { isRoomInRedis, addSocketToRoom, setSocketRoom, socketMap, setSocketUser, getUserCountInRoom, getRoomSockets } from "../state/state";
import { sendContent, sendError } from "../utils/SendResponse";
import { v4 as uuidv4 } from 'uuid';

interface JoinRoomPayload {
    id: string,
    username: string,
    roomId: string,
}

export async function JoinRoomHandler(socket: WebSocket, payload: JoinRoomPayload) {
    const { id, username, roomId } = payload;

    if(!username){
        return sendError(socket, { message: `Username can't be empty` });
    }

    if (!roomId) {
        return sendError(socket, { message: `Room id can't be empty` });
    }

    try{
        const roomExists = await isRoomInRedis(roomId);
        if(! roomExists){
            return sendError(socket, { message: 'Room Not Found' });
        }

        let socketId: string;

        if((socket as any).socketId){
            socketId = (socket as any).socketId;
        }
        else{
            socketId = uuidv4();
       
            socketMap.set(socketId, socket);
            (socket as any).socketId = socketId;
        }

        await addSocketToRoom(roomId, socketId);
        await setSocketUser(socketId, username);
        await setSocketRoom(socketId, roomId);

        const socketsInRoom = await getRoomSockets(roomId);
        const socketsCount = await getUserCountInRoom(roomId);

        socketsInRoom.forEach((socketId) => {
            const clientSocket = socketMap.get(socketId);
            if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
              sendContent(clientSocket, 'roomUserCount', { count: socketsCount, message: `${username} entered into room` });
            }
        })

        return sendContent(socket, 'room_joined', { id: id, username: username, roomId: roomId });
    } catch (error) {
        console.error('Redis error:', error);
        return sendError(socket, { message: 'Server Error occured' });
    }
}