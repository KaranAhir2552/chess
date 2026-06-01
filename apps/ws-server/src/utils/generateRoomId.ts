let roomNumber = 1;

export const generateRoomId = (): string => {
  return `room-${roomNumber++}`;
};
