import express, { Router } from "express";
import { PostController } from './post.controller';

const router=express.Router();

router.get("/",PostController.getAllPost)

router.post("/",PostController.createPost);

router.get(
    "/:postId",
    PostController.getPostById
)

export const postRouter: Router=router ;