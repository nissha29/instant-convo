import { WebSocket } from "ws";
import { sendError } from "../utils/SendResponse";
import findSocketId from "../utils/findSocketId";
import { deleteRoom, getSocketRoom, isRoomEmpty, removeSocket, removeSocketFromRoom, removeSocketRoom, removeSocketUser, socketMap } from "../state/state";

export async function Disconnect(socket: WebSocket) {
  try {
    const socketId = findSocketId(socket);

    if (!socketId) {
      return sendError(socket, 'Socket Not Found');
    }

    const roomId = await getSocketRoom(socketId);

    if (roomId) {
      await removeSocketFromRoom(roomId, socketId);
      
      if (await isRoomEmpty(roomId)) {
        await deleteRoom(roomId);
      }
    }

    await removeSocketUser(socketId);
    await removeSocketRoom(socketId);
    removeSocket(socketId);
  } catch (error) {
    console.error('Redis error:', error);
    return sendError(socket, 'Server Error occured');
  }
}