import { WebSocket } from "ws"
import { isRoomInRedis, addSocketToRoom, setSocketRoom, socketMap, setSocketUser } from "../state/state";
import { sendContent, sendError } from "../utils/SendResponse";
import { v4 as uuidv4 } from 'uuid';

interface JoinRoomPayload {
    username: string,
    roomId: string,
}

export async function JoinRoomHandler(socket: WebSocket, payload: JoinRoomPayload) {
    const { username, roomId } = payload;

    if(!username){
        return sendError(socket, `Username can't be empty`);
    }

    if (!roomId) {
        return sendError(socket, `Room id can't be empty`);
    }

    try{
        const roomExists = await isRoomInRedis(roomId);
        if(! roomExists){
            return sendError(socket, 'Room Not Found');
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

        return sendContent(socket, 'room_joined', { username: username, roomId: roomId });
    } catch (error) {
        console.error('Redis error:', error);
        return sendError(socket, 'Server Error occured');
    }
}