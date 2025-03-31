import { WebSocket } from "ws";
import { sendContent, sendError } from "../utils/SendResponse";
import findSocketId from "../utils/findSocketId";
import { deleteRoom, getRoomSockets, getSocketRoom, getUserCountInRoom, isRoomEmpty, removeSocket, removeSocketFromRoom, removeSocketRoom, removeSocketUser, socketMap } from "../state/state";

export async function Disconnect(socket: WebSocket) {
  try {
    const socketId = findSocketId(socket);

    if (!socketId) {
      return sendError(socket, { message: 'Socket Not Found' });
    }

    const roomId = await getSocketRoom(socketId);

    if (roomId) {
      await removeSocketFromRoom(roomId, socketId);
      
      if (await isRoomEmpty(roomId)) {
        await deleteRoom(roomId);
      }

      const socketsInRoom = await getRoomSockets(roomId);
      const socketsCount = await getUserCountInRoom(roomId);

      socketsInRoom.forEach((socketId) => {
        const clientSocket = socketMap.get(socketId);
        if(clientSocket && clientSocket.readyState === WebSocket.OPEN){
          sendContent(clientSocket, 'roomUserCount', { count: socketsCount });
        }
      })
    }

    await removeSocketUser(socketId);
    await removeSocketRoom(socketId);
    removeSocket(socketId);

    return sendContent(socket, 'room_left', { message: 'You are disconnected'});
  } catch (error) {
    console.error('Redis error:', error);
    return sendError(socket, { message: 'Server Error occured' });
  }
}