import { clientRooms, socketToUser } from "../state/state";
import { WebSocket } from "ws";

export function Disconnect(socket: WebSocket) {
    socketToUser.delete(socket);
    
    clientRooms.forEach((sockets, roomId) => {
      const index = sockets.indexOf(socket);
      if (index !== -1) {
        sockets.splice(index, 1);

        if (sockets.length === 0) {
          clientRooms.delete(roomId);
        }
      }
    });
  }