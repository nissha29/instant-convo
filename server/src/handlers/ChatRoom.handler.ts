import { WebSocket } from "ws";
import { getRoomSockets, getSocketRoom, getSocketUser, socketMap } from "../state/state";
import { sendContent, sendError } from "../utils/SendResponse";
import findSocketId from "../utils/findSocketId";

interface ChatRoomPayload {
    username: string,
    message: string,
}

export async function ChatRoomHandler(socket: WebSocket, payload: ChatRoomPayload) {
    const { message } = payload;

    try {
        const socketId = findSocketId(socket);

        if (!socketId) {
            return sendError(socket, { message: 'Socket Not Found'} );
        }

        const username = await getSocketUser(socketId);

        if (!username) {
            return sendError(socket, { message: 'User Not Found' });
        }

        const currentUserRoom = await getSocketRoom(socketId);

        if (!currentUserRoom) {
            return sendError(socket, { message: 'You are not in any room' });
        }

        const socketsInCurrentRoom = await getRoomSockets(currentUserRoom);

        socketsInCurrentRoom?.forEach((socketId) => {
            const clientSocket = socketMap.get(socketId);
            if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
                sendContent(clientSocket, 'chat', { username, message });
            }
        });
    } catch (error) {
        console.error('Redis error:', error);
        return sendError(socket, { message: 'Server Error occured' });
    }
}