import { WebSocket } from "ws";
import { isRoomInRedis, createRoomInRedis, socketMap } from "../state/state";
import { sendContent, sendError } from "../utils/SendResponse";
import { v4 as uuidv4 } from 'uuid';

interface CreateRoomPayload {
    roomId: string,
}

export async function CreateRoom(socket: WebSocket, payload: CreateRoomPayload) {
    const { roomId } = payload;

    try {
        const roomExists = await isRoomInRedis(roomId);

        if (roomExists) {
            return sendError(socket, { message: 'Room already exists' });
        }
        else {
            const socketId = uuidv4();

            socketMap.set(socketId, socket);
            (socket as any).socketId = socketId;

            await createRoomInRedis(roomId);

            return sendContent(socket, 'room_created', { roomId: roomId });
        }
    } catch (error) {
        console.error('Redis error:', error);
        return sendError(socket, { message: 'Server Error Occured' });
    }
}