import { Request, Response, Router } from "express";
import prisma from '@repo/db/client';
import { getUserFromToken } from "../middleware/userInfo";
import { UserInfoRequest } from "../types";

const roomRouter = Router();

roomRouter.get('/:roomId', async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params; 
        if (!roomId) {
            res.status(400).json({ message: "roomId is required" });
        }

        const room = await prisma.rooms.findUnique({
            where: {
                id: roomId as string,
            },
        });

        if (!room) {
            res.status(404).json({ message: "No room found" }); 
        }

        res.status(200).json({ data: room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

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

