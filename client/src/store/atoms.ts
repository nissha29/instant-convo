import { atom } from "recoil";
import { MessageProps } from "../types/MessageProps";

export const generatedRoomCode = atom({
    key: 'roomCode',
    default: '',
})

export  const usersCount = atom({
    key: 'usersCount',
    default: 0,
})

export const joinedStatus = atom({
    key: 'joinedStatus',
    default: false,
})

export const roomCreationStatus = atom({
    key: 'roomCreationStatus',
    default: false,
})

export const usernameState = atom({
    key: 'username',
    default: '',
})

export const uniqueId = atom({
    key: 'uniqueId',
    default: '',
})

export const roomIdState = atom({
    key: 'roomId',
    default: '',
})

export const currentMessageDetails = atom<MessageProps[]>({
    key: 'currentMessageDetails',
    default: [],
})