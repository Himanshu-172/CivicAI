import mongoose from "mongoose";
import type { Logger } from "pino";

export async function connectToMongoDB(uri: string, logger: Logger): Promise<void> {
  await mongoose.connect(uri);
  logger.info("MongoDB connection established");
}

export async function disconnectFromMongoDB(logger: Logger): Promise<void> {
  await mongoose.disconnect();
  logger.info("MongoDB connection closed");
}

