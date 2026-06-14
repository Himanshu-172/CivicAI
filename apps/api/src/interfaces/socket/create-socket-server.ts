import type { Server as HttpServer } from "node:http";
import { Server as SocketServer } from "socket.io";
import { env } from "../../infrastructure/config/environment.js";
import { logger } from "../../infrastructure/logging/logger.js";

export function createSocketServer(httpServer: HttpServer): SocketServer {
  const socketServer = new SocketServer(httpServer, {
    cors: {
      origin: env.CORS_ORIGINS,
      credentials: true,
    },
  });

  socketServer.on("connection", (socket) => {
    logger.debug({ socketId: socket.id }, "Socket.io client connected");
  });

  return socketServer;
}

