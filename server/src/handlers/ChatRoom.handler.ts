import { WebSocket } from "ws";
import { clientRooms, socketToUser } from "../state/state";

interface ChatRoomPayload {
    username: string,
    message: string,
}

function findCurrentSocketRoom(socket: WebSocket) {
    for (const [roomId, sockets] of clientRooms.entries()) {
        if (sockets.includes(socket)) {
            return roomId;
        }
    }
    return null;
}

export function ChatRoomHandler(socket: WebSocket, payload: ChatRoomPayload) {
    const { message } = payload;

    const username = socketToUser.get(socket);
  
    if (!username) {
        socket.send(JSON.stringify({
            type: 'error',
            success: false,
            message: 'You need to join a room with a username first',
        }));
        return;
    }

    const currentUserRoom = findCurrentSocketRoom(socket);

    if (!currentUserRoom) {
        socket.send(JSON.stringify({
            type: 'error',
            success: false,
            message: 'You are not in any room'
        }));
        return;
    }

    const socketsInCurrentRoom = clientRooms.get(currentUserRoom);

    socketsInCurrentRoom?.forEach((client) => {
        client.send(JSON.stringify({
            type: 'chat',
            username,
            message
        }));
    });
}