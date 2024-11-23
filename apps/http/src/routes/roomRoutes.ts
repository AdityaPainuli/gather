import { Request, Response, Router } from "express";
import prisma from '@repo/db/client';
import { getUserFromToken } from "../middleware/userInfo";
import { UserInfoRequest } from "../types";

const roomRouter = Router();

roomRouter.get('/:roomId',async(req:Request , res:Response)=> {
    const {roomId} = req.query;
    const room = await prisma.rooms.findUnique({
        where: {
            id: roomId as string
        }
    });
    if(!room) {
        res.status(401).json({message:"No room found"});
    }
    res.status(200).json({data:room});
})

roomRouter.get('/:roomId/user-info',async(req:Request , res:Response) => {
    const {roomId} = req.query;
    const userInsideRoom = await prisma.roomUser.findMany({
        where: {
            roomId:roomId as string
        },
        select : {
            user:true
        }
    })
    if(userInsideRoom.length === 0) {
        res.json({message:"No user found"})
    }
    res.status(200).json({data:userInsideRoom});
})

roomRouter.delete('/:roomId'  , getUserFromToken,async(req:UserInfoRequest , res:Response) => {
    const {roomId} = req.query;
    if(!req.user) {
        res.json({message:"user not found"})
    }
   await prisma.roomUser.delete({
    where : {
           role_userId_roomId : {
            roomId: roomId as string,
            userId: req.user.id,
            role:"ADMIN"
           }
    }
   }).catch((e) => {
    console.log('error ->',e);
    res.json({message:"Something went wrong "})
   })
    res.json({message:"Successfully deleted the room."})
})

export default roomRouter;

