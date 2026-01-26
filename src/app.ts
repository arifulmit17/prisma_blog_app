import express, { Application } from "express";
import { postRouter } from "./modules/post/post.router";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import cors from "cors"
import { commentRouter } from "./modules/comments/comment.router";

const app: Application=express();

const allowedOrigins = [
  "http://localhost:4000",
  "http://localhost:3001",
];

app.use(cors({
    origin:process.env.APP_URL || allowedOrigins,
    credentials:true
}))

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json());

app.use("/posts",postRouter)
app.use("/comments",commentRouter)

app.get("/",(req,res)=>{
    res.send("server is making a new post");
})

export default app;