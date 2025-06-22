import { copyRoomCode } from "../utils/CopyRoomCode";
import { generateCode } from "../utils/generateCode";
import { Refresh, Copy, Loader } from "../icons/icons";
import { useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { roomCreationStatus, roomIdState, uniqueId } from "../store/atoms";
import { useWebSocket } from "../utils/CreateConnection";
import toast from "react-hot-toast";

export default function JoinRoom() {
    const [roomId, setRoomId] = useRecoilState(roomIdState);
    const setUniqueId = useSetRecoilState(uniqueId);
    const [isRoomCreated, setIsRoomCreated] = useRecoilState(roomCreationStatus);
    const [isLoading, setIsLoading] = useState(false);
    const usernameRef = useRef<HTMLInputElement>(null);
    const roomIdRef = useRef<HTMLInputElement>(null);
    const { connect, sendMessage } = useWebSocket();

    function createNewRoom() {
        setIsRoomCreated(true);

        let ws = connect();

        const roomCode = generateCode(7);
        setRoomId(roomCode);
        const type = 'create_room';
        const payload = {
            roomId: roomCode,
        }

        if (ws?.readyState === WebSocket.OPEN) {
            sendMessage(type, payload);
        } else {
            ws?.addEventListener('open', () => {
                sendMessage(type, payload);
            });
        }
        setIsRoomCreated(false);
    }

    function joinRoom() {
        setIsLoading(true);
        const enteredUsername = usernameRef.current?.value;
        const enteredRoomCode = roomIdRef.current?.value

        if (!enteredUsername) {
            toast.error("Username is required");
            return;
        }

        if(!enteredRoomCode){
            toast.error("Room Code is required");
            return;
        }
        const id = generateCode(7);
        setUniqueId(id);

        const type = 'join_room';
        const payload = {
            id: id,
            username: enteredUsername,
            roomId: enteredRoomCode,
        }

        let ws = connect();

        if (ws?.readyState === WebSocket.OPEN) {
            sendMessage(type, payload);
        } else {
            ws?.addEventListener('open', () => {
                sendMessage(type, payload);
            });
        }
    }

    return (
        <div className='flex flex-col h-screen w-full bg-black text-white items-center justify-center font-mono px-4'>
            <div className="border border-gray-700 rounded-lg py-6 shadow-2xl w-full max-w-md px-6 tracking-wider">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Join Instant Convo</h2>

                <button
                    onClick={createNewRoom}
                    className="hover:bg-white bg-white/90 rounded-xl text-black w-full p-3 mb-4 flex items-center justify-center gap-2 transition-colors"
                >
                    {!isRoomCreated
                        ?
                        <div className="flex gap-2">
                            <Refresh />
                            Create New Room
                        </div>
                        :
                        <div className="animate-spin">
                            <Loader />
                        </div>
                    }
                </button>

                {roomId && (
                    <div className="bg-white/20 rounded-lg p-4 mb-4 flex justify-between items-center">
                        <span className="text-lg sm:text-xl font-mono tracking-wider">{roomId}</span>
                        <button
                            onClick={async () => {
                                const success = await copyRoomCode(roomId);
                                if (success) {
                                    toast.success("Room code copied!");
                                } else {
                                    toast.error("Failed to copy room code");
                                }
                            }}
                            className="text-gray-400 hover:text-white transition-colors"
                            title="Copy Room Code"
                        >
                            <Copy />
                        </button>
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Username</label>
                    <input
                        ref={usernameRef}
                        type="text"
                        placeholder="Enter your name"
                        className="w-full p-3 rounded-lg bg-transparent text-white border border-gray-600"
                    />
                </div>

                <div className="mb-3">
                    <label className="block text-gray-300 mb-2">Room Code</label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <input
                            ref={roomIdRef}
                            type="text"
                            placeholder="Enter room code"
                            className="w-full sm:flex-grow p-3 rounded-lg bg-transparent text-white border border-gray-600"
                        />
                        <button
                            onClick={() => joinRoom()}
                            className="w-full sm:w-auto bg-white/90 text-black text-base sm:text-lg px-4 sm:px-7 py-3 rounded-xl hover:bg-white transition-colors font-medium whitespace-nowrap"
                        >
                            {isLoading
                                ?
                                <div className="animate-spin">
                                    <Loader />
                                </div>
                                :
                                'Join Room'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
