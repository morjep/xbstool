import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();


function log() {
  console.log("Seeding complete!");

}
