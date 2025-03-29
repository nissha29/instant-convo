import { clientRooms } from "../state/state";
import { WebSocket } from "ws";

interface CreateRoomPayload {
    roomId: string,
    username: string,
}

export function CreateRoom(socket: WebSocket, payload: CreateRoomPayload) {
    const { roomId } = payload;

    if (clientRooms.has(roomId)) {
        socket.send(JSON.stringify({
            type: `error`,
            success: false,
            message: `Room already exists`,
        }))
    }
    else {
        clientRooms.set(roomId, [socket]);
        socket.send(JSON.stringify({
            type: 'room_created',
            roomId: roomId,
            success: true,
        }))
    }
}