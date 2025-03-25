export function generateRoomCode() {
    const s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomCode = '';
    
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * s.length);
      roomCode += s[randomIndex];
    }
    
    return roomCode;
  }