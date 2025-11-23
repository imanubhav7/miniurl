import { PrismaClient } from "@prisma/client";

let db;
if(!global._db){

    global._db = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
    })
}
db = global._db;
export default db