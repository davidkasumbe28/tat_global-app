import { collectionData, productData, userData } from "@/lib/data/mock/prisma.seed";
import { PrismaClient} from "@/lib/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
    for (const c of collectionData) {
    await prisma.collection.create({ data: c });
  }
    for (const p of productData) {
    await prisma.product.create({ data: p });
  }
}

main();