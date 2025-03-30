import { WebSocket } from "ws";

export function sendContent(socket: WebSocket, type: string, payload: Object) {
    socket.send(JSON.stringify({
        type: type,
        success: true,
        payload: payload,
    }));
    return true;
}

export function sendError(socket: WebSocket, message: string) {
    socket.send(JSON.stringify({
        type: 'error',
        success: false,
        message: message,
    }));
    return false;
}