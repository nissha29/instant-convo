import { WebSocket } from "ws";
import { socketMap } from "../state/state";

export default function findSocketId(socket: WebSocket) {
    let socketId = '';
    for (const [id, ws] of socketMap.entries()) {
        if (ws === socket) {
            socketId = id;
            break;
        }
    }
    return socketId;
}