import { Request, Response } from "express";
import { postService } from "./post.service"
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const createPost=async (req:Request,res:Response)=>{
    try{
        const result=await postService.createPost(req.body)
        res.status(201).json(result);
    }
    catch(error){
        console.error(error);
        res.status(400).json({message:"Post creation failed"});
}
}

const getAllPost=async(req:Request,res:Response)=>{
    try{
        const {search}=req.query
        const searchString=typeof search === 'string'? search:undefined
        const tags=req.query.tags ? (req.query.tags as string).split(','):[]
        const isFeatured=req.query.isFeatured ? req.query.isFeatured ==='true': undefined
        const status=req.query.status as PostStatus | undefined

        const {page,limit,skip,sortBy,sortOrder}=paginationSortingHelper(req.query)
        
        const result=await postService.getAllPost({search:searchString,tags,isFeatured,status,page,limit,skip,sortBy,sortOrder})
       res.status(200).json(result)

    }
    catch(error){
        console.error(error);
        res.status(400).json({message:"Post creation failed"});
}

}

const getPostById = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            throw new Error("Post Id is required!")
        }
        const result = await postService.getPostById(postId);
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Post creation failed",
            details: e
        })
    }
}
export const PostController={
    createPost,
    getAllPost,
    getPostById
}