import { Server } from "socket.io";

export const onlineUsers =
  (global as any).onlineUsers || {};