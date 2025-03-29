import { useRef } from "react";
import { useSetRecoilState } from "recoil";
import { connectionStatus } from "../store/atoms";

export function createConnection(){
    const wsRef = useRef<WebSocket | null>(null);
    const setIsConnected = useSetRecoilState(connectionStatus);

    function connect(){
        if(! wsRef || wsRef.current?.readyState === WebSocket.CLOSED){
            const ws = new WebSocket(`ws://localhost:8080`);

            ws.onopen = () => {
                setIsConnected(true);
            }

            ws.onclose = () => {
                setIsConnected(false);
            }

            ws.onerror = () => {
                console.log(`ws error`);
            }

            wsRef.current = ws;
        }
        return wsRef.current;
    }

    return {
        connect,
    }
}