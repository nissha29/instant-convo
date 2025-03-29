import { WebSocket } from "ws";

export const clientRooms = new Map<string, WebSocket[]>();
export const socketToUser = new Map<WebSocket, string>();