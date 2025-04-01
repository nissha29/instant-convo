import { MessageProps } from "../types/MessageProps";

export default function Message(props: MessageProps) {
  return (
    <>
      <div className="inline-flex max-w-[65%] self-end flex-col">
        <div className="flex justify-between items-center mb-1 text-xs text-gray-500">
          <span>{props.username}</span>
          <span>{props.time}</span>
        </div>
        <span className="bg-white text-black rounded-md px-4 py-2">
          <span>{props.message}</span>
        </span>
      </div>
    </>
  );
}