import { Response, Router , Request } from "express";
import prisma from '@repo/db/client';
export const userRouter = Router();


userRouter.get("/",async(req:Request , res:Response) => {
    
    res.json("Api is working fine ")
});

userRouter.get('/rooms', async(req:Request , res:Response) => {
    
    res.json("Send all joined room");
})


userRouter.post('/join-room', async(req:Request , res:Response) => {
    res.json("Join a room");
})

userRouter.post('/create-room' , async(req:Request , res:Response) => {
    res.json("create a room");
})

userRouter.get('/:id',async(req:Request , res:Response) => {
    const {id} = req.query;
    res.json(`Getting information for user ${id}`);
})

