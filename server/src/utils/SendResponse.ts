import { WebSocket } from "ws";

export function sendContent(socket: WebSocket, type: string, payload: Object) {
    socket.send(JSON.stringify({
        type: type,
        success: true,
        payload: payload,
    }));
    return true;
}

export function sendError(socket: WebSocket, payload: Object) {
    socket.send(JSON.stringify({
        type: 'error',
        success: false,
        payload: payload,
    }));
    return false;
}