import app from "./app";
import { prisma } from "./lib/prisma";

async function main() {
    try{
       await prisma.$connect()
       console.log("Database connected successfully.");
       const Port=process.env.PORT || 3000;
       app.listen(Port,()=>{
        console.log(`server is running on port ${Port}`);
       })
    }catch(error){
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
}
main();