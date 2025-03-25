import { useEffect, useRef, useState } from "react";
import MyMessage from "./components/MyMessage";
// import ReceivedMessage from "./components/ReceivedMessage";

interface formDataProps {
  type: string,
  payload: {
    message?: string,
    roomId?: string,
  }
}

function App() {

  const [messages, setMessages] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<formDataProps>({
    'type': '',
    'payload': {}
  })

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080`);
    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data]);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
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

  return (
    <>
      <div className='flex flex-col h-screen w-full bg-black text-white items-center'>
        <div className="flex gap-5 justify-center items-center font-bold text-3xl sm:text-4xl mt-5 font-mono tracking-wider">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-11">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
          Instant Chat
        </div>

        <div className="flex gap-5 justify-center items-center bg-gray-900/80 rounded-xl w-80 sm:w-96 px-3 mt-5 mx-10">
          <div className="flex justify-between items-center w-full py-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-lg font-semibold text-gray-300">Room Code:</span>
                <span className="text-sm sm:text-lg font-medium text-white tracking-wider">ABC123</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy-icon lucide-copy hover:cursor-pointer hover:text-green-500"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-lg text-gray-300 font-semibold">Users:</span>
                <span className="text-sm sm:text-lg font-medium text-white">3/10</span>
              </div>
            </div>
            <button className="flex items-center gap-2 text-white px-3 py-2 rounded-lg transition-colors duration-300 ease-in-out hover:cursor-pointer hover:text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-door-closed size-5 sm:size-6"><path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" /><path d="M2 20h20" /><path d="M14 12v.01" /></svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="bg-black" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-9 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}

export default App;
