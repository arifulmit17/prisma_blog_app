import express, { Router } from "express";
import { PostController } from './post.controller';

const router=express.Router();

router.get("/",PostController.getAllPost)

router.post("/",PostController.createPost);

export const postRouter: Router=router ;