import { useRef } from "react";
import toast from "react-hot-toast";
import { useSetRecoilState } from "recoil";
import { generatedRoomCode, joinedStatus, usernameState, usersCount } from "../store/atoms";

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const setRoomCode = useSetRecoilState(generatedRoomCode);
  const setUsername = useSetRecoilState(usernameState);
  const setIsJoined = useSetRecoilState(joinedStatus);
  const setSocketCount = useSetRecoilState(usersCount);

  function connect() {
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      return wsRef.current;
    }
    const ws = new WebSocket(`ws://localhost:8080`);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onclose = (event) => {
      console.log("WebSocket disconnected", event.code, event.reason);
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error:`, error);
      toast.error('Error');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const type = data.type;
      console.log(data);

      if(type === 'room_created'){
        toast.success(`Room created successfully`);
      }
      if(type === 'room_joined'){
        setUsername(data.payload.username);
        setRoomCode(data.payload.roomId);
        setIsJoined(true);
        toast.success(`Room joined successfully`);
      }
      if(type === 'roomUserCount'){
        setSocketCount(data.payload.count);
      }
      if(type === 'room_left'){
        toast.success('You are disconnected');
      }
      if(type === 'chat'){
        
      }
      if(type === 'error'){
        toast.error(data.payload.message);
      }
    };

    wsRef.current = ws;
    return wsRef.current;
  }

  function sendMessage(type: string, payload: any) {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, payload });
      wsRef.current.send(message);
      console.log("Sent message:", message);
      return true;
    }
    console.log("Failed to send message - connection not open");
    return false;
  }

  return {
    connect,
    sendMessage,
    socket: wsRef
  };
}