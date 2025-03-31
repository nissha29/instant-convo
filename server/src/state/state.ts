import { WebSocket } from "ws";
import { RedisClient } from "../redis";

export const socketMap = new Map<string, WebSocket>();

export async function isRoomInRedis(roomId: string): Promise<boolean> {
    const exists = await RedisClient.exists(`room:${roomId}`);
    return exists === 1;
}

export async function createRoomInRedis(roomId: string): Promise<void> {
    await RedisClient.set(`room:${roomId}`, JSON.stringify({ created: Date.now() }));
}

export async function addSocketToRoom(roomId: string, socketId: string): Promise<void> {
    await RedisClient.sadd(`room:${roomId}:sockets`, socketId);
}

export async function deleteRoom(roomId: string): Promise<void> {
    await RedisClient.del(`room:${roomId}`);
    await RedisClient.del(`room:${roomId}:sockets`);
}

export async function getRoomSockets(roomId: string): Promise<string[]> {
    return await RedisClient.smembers(`room:${roomId}:sockets`);
}

export async function removeSocketFromRoom(roomId: string, socketId: string): Promise<void> {
    await RedisClient.srem(`room:${roomId}:sockets`, socketId);
}

export async function setSocketUser(socketId: string, username: string): Promise<void> {
    await RedisClient.set(`socket:${socketId}:user`, username);
}

export async function getSocketUser(socketId: string): Promise<string | null> {
    return await RedisClient.get(`socket:${socketId}:user`);
}

export async function removeSocketUser(socketId: string): Promise<void> {
    await RedisClient.del(`socket:${socketId}:user`);
}

export async function setSocketRoom(socketId: string, roomId: string): Promise<void> {
    await RedisClient.set(`socket:${socketId}:room`, roomId);
}

export async function getSocketRoom(socketId: string): Promise<string | null> {
    return await RedisClient.get(`socket:${socketId}:room`);
}

export async function removeSocketRoom(socketId: string): Promise<void> {
    await RedisClient.del(`socket:${socketId}:room`);
}

export async function isRoomEmpty(roomId: string): Promise<boolean> {
    const sockets = await getRoomSockets(roomId);
    return sockets.length === 0;
}

export async function removeSocket(socketId: string): Promise<void> {
    socketMap.delete(socketId);
}

export async function getUserCountInRoom(roomId: string): Promise<number> {
    const sockets = await getRoomSockets(roomId);
    return sockets.length;

}