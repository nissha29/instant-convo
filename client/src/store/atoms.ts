import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const connectionStatus = atom({
    key: 'connectionStatus',
    default: false,
})

export const joinedStatus = atom({
    key: 'joinedStatus',
    default: false,
    effects_UNSTABLE: [persistAtom],
})

export const roomCreationStatus = atom({
    key: 'roomCreationStatus',
    default: false,
})

export const messagesState = atom<string[]>({
    key: 'messages',
    default: [],
    effects_UNSTABLE: [persistAtom],
})

export const usernameState = atom({
    key: 'username',
    default: null,
    effects_UNSTABLE: [persistAtom],
})

export const roomIdState = atom({
    key: 'roomId',
    default: '',
    effects_UNSTABLE: [persistAtom],
})