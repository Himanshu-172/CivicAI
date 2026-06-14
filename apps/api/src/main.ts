import { createServer, type Server as HttpServer } from "node:http";
import type { Server as SocketServer } from "socket.io";
import { env } from "./infrastructure/config/environment.js";
import {
  connectToMongoDB,
  disconnectFromMongoDB,
} from "./infrastructure/database/mongodb.js";
import { logger } from "./infrastructure/logging/logger.js";
import { createApp } from "./interfaces/http/create-app.js";
import { createSocketServer } from "./interfaces/socket/create-socket-server.js";

let httpServer: HttpServer | undefined;
let socketServer: SocketServer | undefined;

async function start(): Promise<void> {
  if (env.MONGODB_CONNECT_ON_START) {
    await connectToMongoDB(env.MONGODB_URI, logger);
  } else {
    logger.warn("MongoDB startup connection disabled");
  }

  httpServer = createServer(createApp());
  socketServer = createSocketServer(httpServer);

  httpServer.listen(env.API_PORT, env.API_HOST, () => {
    logger.info(
      { host: env.API_HOST, port: env.API_PORT },
      "CivicAI API server listening",
    );
  });
}

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  logger.info({ signal }, "Shutting down CivicAI API");

  await socketServer?.close();
  await new Promise<void>((resolve, reject) => {
    if (!httpServer?.listening) {
      resolve();
      return;
    }

    httpServer.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });

  if (env.MONGODB_CONNECT_ON_START) {
    await disconnectFromMongoDB(logger);
  }
}

process.once("SIGINT", () => {
  void shutdown("SIGINT").then(() => process.exit(0));
});
process.once("SIGTERM", () => {
  void shutdown("SIGTERM").then(() => process.exit(0));
});

void start().catch((error: unknown) => {
  logger.fatal({ error }, "CivicAI API failed to start");
  process.exit(1);
});

