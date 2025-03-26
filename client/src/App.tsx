import { useEffect, useRef, useState } from "react";
import MyMessage from "./components/MyMessage";
// import ReceivedMessage from "./components/ReceivedMessage";
import Copy from "./icons/Copy";
import Exit from "./icons/Exit";
import Message from "./icons/Message";
import Send from "./icons/Send";
import JoinRoom from "./components/JoinRoom";

interface formDataProps {
  type: string,
  payload: {
    message?: string,
    roomId?: string,
    username?: string,
  }
}

function App() {
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [username, setUsername] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [generatedRoomCode, setGeneratedRoomCode] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<formDataProps>({
    'type': '',
    'payload': {}
  })

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (isJoined) {
      const ws = new WebSocket(`ws://localhost:8080`);
      ws.onmessage = (event) => {
        setMessages(m => [...m, event.data]);
      };

      wsRef.current = ws;

      return () => {
        ws.close();
      }
    }
  }, [])

  function sendMessage() {
    const message = inputRef.current?.value ?? '';

    if (message.trim()) {
      setFormData({
        type: 'chat',
        payload: {
          message: message
        }
      })
    }

    wsRef.current?.send(JSON.stringify(formData));
  }


  if (!isJoined) {
    return (
      <JoinRoom generatedRoomCode={generatedRoomCode} setGeneratedRoomCode={setGeneratedRoomCode} setIsJoined={setIsJoined} setUsername={setUsername} setRoomId={setRoomId}/>
    );
  }

  return (
    <>
      <div className='flex flex-col h-screen w-full bg-black text-white items-center'>
        <div className="flex gap-5 justify-center items-center font-bold text-3xl sm:text-4xl mt-5 font-mono tracking-wider">
          <Message />
          Instant Chat
        </div>

        <div className="flex gap-5 justify-center items-center bg-gray-900/80 rounded-xl w-80 sm:w-96 px-3 mt-5 mx-10">
          <div className="flex justify-between items-center w-full py-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-lg font-semibold text-gray-300">Room Code:</span>
                <span className="text-sm sm:text-lg font-medium text-white tracking-wider">ABC123</span>
                <Copy />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-lg text-gray-300 font-semibold">Users:</span>
                <span className="text-sm sm:text-lg font-medium text-white">3/10</span>
              </div>
            </div>
            <button className="flex items-center gap-2 text-white px-3 py-2 rounded-lg transition-colors duration-300 ease-in-out hover:cursor-pointer hover:text-red-500">
              <Exit />
              <span className="text-sm sm:text-lg font-semibold">Exit</span>
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
          <button onClick={sendMessage} className="bg-white rounded-full p-1 hover:cursor-pointer" title="Send Message">
            <Send />
          </button>
        </div>
      </div>
    </>
  )
}

export default App;
