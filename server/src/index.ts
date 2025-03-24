import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

const clientRooms = new Map<string, WebSocket[]>();

wss.on('connection', (socket) =>{
    console.log(`User connected`);

    socket.on('message', (message) => {
        const parsedMessage = JSON.parse(message.toString());

        if(parsedMessage.type == 'join'){
            const roomId = parsedMessage.payload.roomId;
            if(clientRooms.has(roomId)){
                clientRooms.get(roomId)?.push(socket);
            }
            else{
                clientRooms.set(roomId, [socket]);
            }
        }
        else if(parsedMessage.type == 'chat'){{
            let currentUserRoom: string | null = null;
            clientRooms.forEach((sockets, roomId) => {
                if(sockets.includes(socket)){
                    currentUserRoom = roomId;
                }
            })

            if(currentUserRoom){
                const receivedMessage = parsedMessage?.payload?.message;
                const socketsInCurrentRoom = clientRooms.get(currentUserRoom);

                socketsInCurrentRoom?.forEach((client) => {
                    client.send(receivedMessage);
                })
            }
            else{
                console.log(`${currentUserRoom} Room does not exist`)
            }
        }}
    })
})