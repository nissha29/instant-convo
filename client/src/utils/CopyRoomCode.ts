export const copyRoomCode = async (roomId: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(roomId);
    return true;
  } catch (error) {
    console.error("Failed to copy room code:", error);
    return false;
  }
};