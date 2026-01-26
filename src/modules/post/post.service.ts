import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { _length } from './../../../node_modules/zod/src/v4/core/api';
import { LimitNode } from './../../../node_modules/kysely/dist/esm/operation-node/limit-node';
import { Request, Response } from "express";


const createPost = async (data: Omit<Post , "id"|"createdAt"|"updatedAt">)=>{
   const result= await prisma.post.create({data})
   return result;
}

const getAllPost=async(payload:{
    search:string | undefined,
    tags:string[]|[]
    isFeatured:boolean | undefined,
    status:PostStatus | undefined,
    page:number,
    limit:number,
    skip:number,
    sortBy:string ,
    sortOrder:string 

})=>{

    const andConditions:PostWhereInput[]=[]
    if(payload.search){
       andConditions.push({ OR:[
                {
                    title:{
                contains:payload.search as string,
                mode:"insensitive"
            }

                },
                {
                    content:{
                contains:payload.search as string,
                mode:"insensitive"
            }

                },
                {
                    tags:{
                has:payload.search as string,
                
            }

                }

            ]})
    }

    if(payload.tags.length>0){
       andConditions.push({ tags:{
                hasEvery:payload.tags
            }})
    }
    if(typeof payload.isFeatured==='boolean'){
       andConditions.push({
        isFeatured:payload.isFeatured
       })
    }

    if(payload.status){
        andConditions.push({
            status:payload.status
        })
    }
    const allpost=await prisma.post.findMany({
        take:payload.limit,
        skip:payload.skip,
        where:{
           AND:andConditions
           
            
        },
        orderBy:{
            [payload.sortBy]:payload.sortOrder
        }
    });
    return allpost
}

const getPostById = async (postId: string) => {
    return await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: postId
            },
            data: {
                views: {
                    increment: 1
                }
            }
        })
        const postData = await tx.post.findUnique({
            where: {
                id: postId
            },
            // include: {
            //     comments: {
            //         where: {
            //             parentId: null,
            //             status: CommentStatus.APPROVED
            //         },
            //         orderBy: { createdAt: "desc" },
            //         include: {
            //             replies: {
            //                 where: {
            //                     status: CommentStatus.APPROVED
            //                 },
            //                 orderBy: { createdAt: "asc" },
            //                 include: {
            //                     replies: {
            //                         where: {
            //                             status: CommentStatus.APPROVED
            //                         },
            //                         orderBy: { createdAt: "asc" }
            //                     }
            //                 }
            //             }
            //         }
            //     },
            //     _count: {
            //         select: { comments: true }
            //     }
            // }
        })
        return postData
    })
}

export const postService={
    createPost,
    getAllPost,
    getPostById
}