import { io, Socket } from "socket.io-client"; //웹소켓

const socketInit = () => {
  const socket: Socket = io("http://localhost:3065", {
    withCredentials: true,
    transports: ["websocket"],
  });
  return socket;
};

export default socketInit;
