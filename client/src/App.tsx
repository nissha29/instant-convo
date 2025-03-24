import MyMessage from "./components/MyMessage";
import ReceivedMessage from "./components/ReceivedMessage";

function App() {
  return (
    <>
      <div className='flex flex-col h-screen w-full bg-black text-white justify-between'>
        <div className="flex gap-5 justify-center items-center font-bold text-3xl sm:text-4xl mt-5 font-mono tracking-wider">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-11">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
          Instant Chat
        </div>
        <div className="w-full flex justify-center items-center sm:px-14 px-4 pt-5">
          <div className="border border-gray-500 p-3 rounded-xl w-full flex flex-col" style={{ height: 'calc(100vh - 14rem)' }}>
            <div className="flex flex-col gap-4 overflow-y-auto flex-grow scrollbar-none">
              <MyMessage />
              <MyMessage />
              <ReceivedMessage />
              <ReceivedMessage />
              <MyMessage />
              <MyMessage />
              <ReceivedMessage />
              <ReceivedMessage />
              <MyMessage />
              <MyMessage />
              <ReceivedMessage />
              <ReceivedMessage />
              <MyMessage />
              <MyMessage />
              <ReceivedMessage />
              <ReceivedMessage />
            </div>
          </div>
        </div>
        <div className="w-full sm:px-14 px-4 flex justify-center items-center">
          <input className="border border-gray-500 p-3 rounded-xl h-14 w-full my-10 bg-transparent  placeholder:text-gray-600" type="text" placeholder="Type Your Message Here...." />
          <div className="fixed right-7 sm:right-[4.5rem] bg-white rounded-full p-1 hover:cursor-pointer" title="Send Message">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 text-black">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>

          </div>
        </div>
      </div>
    </>
  )
}

export default App;
