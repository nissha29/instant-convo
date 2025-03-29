import { WebSocket } from "ws";

export const clientRooms = new Map<string, WebSocket[]>();