import { WebSocket } from "ws"
import { clientRooms, socketToUser } from "../state/state";

interface JoinRoomPayload {
    username: string,
    roomId: string,
}

function sendError(socket: WebSocket, message: string) {
    socket.send(JSON.stringify({
        type: 'error',
        message,
        success: false
    }));
    return null;
}

export function JoinRoomHandler(socket: WebSocket, payload: JoinRoomPayload) {
    const { username, roomId } = payload;

    if(!username){
        sendError(socket, `Username can't be empty`);
        return;
    }

    if (!roomId) {
        sendError(socket, `Room id can't be empty`);
        return;
    }

    if (clientRooms.has(roomId)) {
        socketToUser.set(socket, username);
        clientRooms.get(roomId)?.push(socket);
        console.log(`User has joined room, ${roomId}`);
        socket.send(JSON.stringify({
            type: 'room_joined',
            roomId: payload.roomId,
            success: true
        }));
    }
    else{
        socket.send(JSON.stringify({
            type: `error`,
            message: `Room Not Found`,
            success: false
        }));
    }
}