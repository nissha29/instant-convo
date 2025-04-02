export function generateCode(n: number) {
  const s = 'ABCDEFGHIJKLM0123456789NOPQRSTUVWXYZ';
  let roomCode = '';

  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * s.length);
    roomCode += s[randomIndex];
  }

  return roomCode;
}