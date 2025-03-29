import { useRef } from "react";
import { useSetRecoilState } from "recoil";
import { connectionStatus } from "../store/atoms";

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const setIsConnected = useSetRecoilState(connectionStatus);

  function connect() {
    if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
      const ws = new WebSocket(`ws://localhost:8080`);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
      };

      ws.onerror = (error) => {
        console.error(`WebSocket error:`, error);
      };

      ws.onmessage = (event) => {
        console.log("Received message:", event.data);
        // Handle incoming messages here
      };

      wsRef.current = ws;
    }
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