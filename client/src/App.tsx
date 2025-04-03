import { KeyboardEvent, useEffect, useRef, useState } from "react";
import Message from "./components/Message";
import { generatedRoomCode, joinedStatus, currentMessageDetails, usernameState, usersCount } from "./store/atoms";
import { MessageIcon, Copy, Exit, Send, Smile } from "./icons/icons";
import JoinRoom from "./components/JoinRoom";
import { useRecoilValue } from "recoil";
import toast from "react-hot-toast";
import { copyRoomCode } from "./utils/CopyRoomCode";
import { useWebSocket } from './utils/CreateConnection';
import EmojiPicker from 'emoji-picker-react';

function App() {
  const isJoined = useRecoilValue(joinedStatus);
  const messagesDetails = useRecoilValue(currentMessageDetails);
  const username = useRecoilValue(usernameState);
  const roomCode = useRecoilValue(generatedRoomCode);
  const socketCount = useRecoilValue(usersCount);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessageToRoom, leaveRoom } = useWebSocket();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  useEffect(() => {
    if (messagesEndRef.current) {
      const { scrollHeight } = messagesEndRef.current;
      messagesEndRef.current.scrollTop = scrollHeight;
    }
  }, [messagesDetails]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showEmojiPicker && !target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  function SendYourMessage() {
    if (inputRef.current && inputRef.current.value.trim() !== '') {
      sendMessageToRoom(inputRef.current.value);
      inputRef.current.value = '';
      setShowEmojiPicker(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      SendYourMessage();
    }
  }

  const onEmojiClick = (emojiData: any) => {
    if (inputRef.current) {
      const emoji = emojiData.emoji;
      const start = inputRef.current.selectionStart || 0;
      const end = inputRef.current.selectionEnd || 0;
      const text = inputRef.current.value;
      const before = text.substring(0, start);
      const after = text.substring(end);

      inputRef.current.value = before + emoji + after;
    }
  };

  if (!isJoined) {
    return (
      <JoinRoom />
    )
  }


  return (
    <>
      <div className='flex flex-col h-screen w-full bg-black text-white items-center'>
        <div className="flex gap-5 justify-center items-center font-bold text-3xl sm:text-4xl mt-5 font-mono tracking-wider">
          <MessageIcon />
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
            <div ref={messagesEndRef} className="overflow-y-auto flex-grow scrollbar-none">
              {messagesDetails.map((curr, index) => {
                return <div key={`${curr.id}-${index}`}>
                  <Message id={curr.id} username={curr.username} message={curr.message} time={curr.time} />
                </div>
              })}
            </div>
          </div>
        </div>

        <div className="w-full sm:px-14 px-4 flex justify-center items-center gap-4 relative">
          <div className="flex w-80 relative">
            <input
              onKeyDown={handleKeyDown}
              ref={inputRef}
              className="border border-gray-500 py-3 pl-3 pr-12 rounded-xl h-14 w-full my-5 bg-transparent placeholder:text-gray-600"
              type="text"
              placeholder="Type Message"
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl hover:text-gray-300 transition-colors"
              title="Emoji"
            >
              <Smile />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-16 right-0 z-10 emoji-picker-container">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>

          <button
            onClick={SendYourMessage}
            className="bg-white rounded-full p-1 hover:cursor-pointer"
            title="Send Message"
          >
            <Send />
          </button>
        </div>
      </div>
    </>
  )
}

export default App;