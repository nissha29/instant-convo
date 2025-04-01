import { useEffect, useRef } from "react";
import MyMessage from "./components/MyMessage";
// import ReceivedMessage from "./components/ReceivedMessage";
import { generatedRoomCode, joinedStatus, messagesState, usernameState, usersCount } from "./store/atoms";
import { Message, Copy, Exit, Send } from "./icons/icons";
import JoinRoom from "./components/JoinRoom";
import { useRecoilValue } from "recoil";
import toast from "react-hot-toast";
import { copyRoomCode } from "./utils/CopyRoomCode";
import { useWebSocket } from './utils/CreateConnection'

function App() {
  const isJoined = useRecoilValue(joinedStatus);
  const messages = useRecoilValue(messagesState);
  const username = useRecoilValue(usernameState);
  const roomCode = useRecoilValue(generatedRoomCode);
  const socketCount = useRecoilValue(usersCount);
  const inputRef = useRef<HTMLInputElement>(null);
  const { leaveRoom } = useWebSocket();

  useEffect(() => {
    const handleBeforeUnload = () => {
      leaveRoom();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      leaveRoom();
    };
  }, []);

  function sendMessageToRoom() {
  }


  if (!isJoined) {
    return (
      <JoinRoom />
    )
  }

  return (
    <>
      <div className='flex flex-col h-screen w-full bg-black text-white items-center'>
        <div className="flex gap-5 justify-center items-center font-bold text-3xl sm:text-4xl mt-5 font-mono tracking-wider">
          <Message />
          Instant Chat
        </div>

        <div className="flex justify-between items-center bg-white/20 rounded-xl w-80 sm:w-96 px-4 py-3 mt-5 mx-10">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Room:</span>
              <span className="text-white font-mono tracking-wider text-sm">{roomCode}</span>
              <button
                onClick={async () => {
                  const success = await copyRoomCode(roomCode);
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

            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Users:</span>
              <span className="text-white text-sm">{socketCount}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <div className="text-white text-sm font-medium">
              {username.toUpperCase().slice(0, 15)}
            </div>
            <button
              className="flex items-center gap-1.5 text-gray-300 hover:text-red-400 transition-colors"
              onClick={leaveRoom}
            >
              <Exit />
              <span className="text-xs">Exit</span>
            </button>
          </div>
        </div>

        <div className="w-full flex justify-center items-center sm:px-14 px-4 pt-5">
          <div className="border border-gray-500 p-4 rounded-xl w-96 flex flex-col" style={{ height: 'calc(100vh - 18rem)' }}>
            <div className="flex flex-col gap-4 overflow-y-auto flex-grow scrollbar-none">
              {/* <MyMessage />
              <ReceivedMessage /> */}
              {messages.map((message) => <MyMessage message={message} />)}
            </div>
          </div>
        </div>

        <div className="w-full sm:px-14 px-4 flex justify-center items-center gap-4">
          <input ref={inputRef} className="border border-gray-500 p-3 rounded-xl h-14 w-80 my-5 bg-transparent  placeholder:text-gray-600" type="text" placeholder="Type Message" />
          <button onClick={sendMessageToRoom} className="bg-white rounded-full p-1 hover:cursor-pointer" title="Send Message">
            <Send />
          </button>
        </div>
      </div>
    </>
  )
}

export default App;
