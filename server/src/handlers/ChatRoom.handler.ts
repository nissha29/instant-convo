import { WebSocket } from "ws";
import { getRoomSockets, getSocketRoom, getSocketUser, socketMap } from "../state/state";
import { sendContent, sendError } from "../utils/SendResponse";
import findSocketId from "../utils/findSocketId";

interface ChatRoomPayload {
    id: string,
    username: string,
    message: string,
}

export async function ChatRoomHandler(socket: WebSocket, payload: ChatRoomPayload) {
    const { id, message } = payload;

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
                const time = new Intl.DateTimeFormat('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }).format(new Date());
                sendContent(clientSocket, 'chat', { id, username, message, time });
            }
        });
    } catch (error) {
        console.error('Redis error:', error);
        return sendError(socket, { message: 'Server Error occured' });
    }
}