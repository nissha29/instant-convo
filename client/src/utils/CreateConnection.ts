import { useRef } from "react";
import toast from "react-hot-toast";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { currentMessageDetails, generatedRoomCode, joinedStatus, uniqueId, usernameState, usersCount } from "../store/atoms";

let websocketInstance: WebSocket | null = null;

export function useWebSocket() {
  const wsRef = useRef(websocketInstance);
  const setRoomCode = useSetRecoilState(generatedRoomCode);
  const [username,setUsername] = useRecoilState(usernameState);
  const setIsJoined = useSetRecoilState(joinedStatus);
  const setSocketCount = useSetRecoilState(usersCount);
  const setMessageDetails = useSetRecoilState(currentMessageDetails);
  const id = useRecoilValue(uniqueId);

  function connect() {
    if (websocketInstance && websocketInstance.readyState !== WebSocket.CLOSED) {
      wsRef.current = websocketInstance;
      return websocketInstance;
    }

    const ws = new WebSocket(`ws://localhost:8080`);
    
    ws.onopen = () => {
      console.log("WebSocket connected");
    };
    
    ws.onclose = (event) => {
      console.log("WebSocket disconnected", event.code, event.reason);
      websocketInstance = null;
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
        if(data.payload?.message){
          toast.success(data.payload.message);
        }
      }
      if(type === 'chat'){
        setMessageDetails((prev) => [...prev, data.payload]);
      }
      if(type === 'error'){
        toast.error(data.payload.message);
      }
    };
    
    wsRef.current = ws;
    websocketInstance = ws;
    return ws;
  }

  function sendMessage(type: string, payload: any) {
    if (websocketInstance && websocketInstance.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, payload });
      websocketInstance.send(message);
      console.log("Sent message:", message);
      return true;
    }
    console.log("Failed to send message - connection not open");
    return false;
  }

  function leaveRoom() {
    if (websocketInstance && websocketInstance.readyState === WebSocket.OPEN) {
      sendMessage('leave_room', {});
      websocketInstance.close();
      websocketInstance = null; 
    }  
    setMessageDetails([]);
    setIsJoined(false);
  }

  function sendMessageToRoom(message: string){
    if(websocketInstance && websocketInstance.readyState === WebSocket.OPEN){
      sendMessage('chat', { id: id, username: username, message: message})
    }
  }

  return {
    connect,
    sendMessage,
    sendMessageToRoom,
    leaveRoom,
    websocketInstance,
  };
}