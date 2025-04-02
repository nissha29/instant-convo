import { useRecoilValue } from "recoil";
import { MessageProps } from "../types/MessageProps";
import { uniqueId } from "../store/atoms";

export default function Message(props: MessageProps) {
  const id = useRecoilValue(uniqueId);
  const isMyMessage = props.id === id;

  return (
    <div className="flex flex-col w-full mb-3">
      {isMyMessage ?
        <div className={`inline-flex max-w-[75%] self-end flex-col`}>
          <div className="flex flex-col gap-1 items-end">
            <div className="bg-white text-black rounded-md px-4 py-2">
              <div className="text-xs font-bold text-gray-700 mb-1">
                {props.username.toUpperCase()}
              </div>
              <span>{props.message}</span>
            </div>
            <span className="text-xs text-gray-500">{props.time}</span>
          </div>
        </div>
        :
        <div className={`inline-flex max-w-[75%] self-start flex-col`}>
          <div className="flex flex-col gap-1 items-start">
            <div className="bg-white text-black rounded-md px-4 py-2">
              <div className="text-xs font-bold text-gray-700 mb-1">
                {props.username.toUpperCase()}
              </div>
              <span>{props.message}</span>
            </div>
            <span className="text-xs text-gray-500">{props.time}</span>
          </div>
        </div>
      }
    </div>
  );
}