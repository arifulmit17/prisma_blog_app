

import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin(){
    try{
        const adminData={
            name:"Admin sir 2",
            email:"admin2@admin.com",
            role:UserRole.ADMIN,
            password:"admin1234"
        }
        const existingUser=await prisma.user.findUnique({
            where:{
                email:adminData.email
            }
        })
        if(existingUser){
            throw new Error("User already exists in db")
        }

        const signupAdmin= await fetch("http://localhost:3000/api/auth/sign-up/email",{
            method:"POST",
            headers:{
                'content-Type':"application/json",
                origin:"http://localhost:3000"
            },
            body:JSON.stringify(adminData)
        })
        console.log(signupAdmin);

        if(signupAdmin){
            await prisma.user.update({
                where: {
                    email:adminData.email
                },
                data:{
                    emailVerified:true
                }
            })
        }

    }catch(error){
       console.log(error);
    }
}

seedAdmin()