import { prismaAdapterConfig } from "./config/prisma-adapter.config.js";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
    super({ adapter });
  }
}
