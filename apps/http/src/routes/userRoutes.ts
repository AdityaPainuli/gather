import { Response, Router , Request } from "express";
import prisma from '@repo/db/client';
import { UserInfoRequest } from "../types";
import { getUserFromToken } from "../middleware/userInfo";


export const userRouter = Router();

userRouter.get("/" , getUserFromToken ,async(req:UserInfoRequest , res:Response) => {
    if(!req.user) {
        res.status(401).json({message:"user not found"});
    }
    const user = await prisma.user.findUnique({
        where: {
            id:req.user.id
        },
        include : {
            roomRoles : {
                select: {
                    role:true,
                    room:{
                        include : {
                            users : true
                        }
                    }
                },
                
            }
        }
    }).catch((e)=> {
        console.log("error ->",e);
        res.json({message:"Something went wrong"})
    })
    res.json({data:user})
});

userRouter.get('/rooms' , getUserFromToken, async(req:UserInfoRequest , res:Response) => {
    if(!req.user){
        res.status(401).json({message:"User not found."})
    }
    const userRooms = await prisma.roomUser.findMany({
        where: {
            userId: req.user.id
        },
        include : {
            room: true
        }
    });
    if(!userRooms) {
        res.json({message:"No rooms found"})
    }
  
    res.status(200).json({data:userRooms});
})


userRouter.post('/join-room', async(req:Request , res:Response) => {
    const {roomId , userId} = req.body;
    await prisma.roomUser.create({
        data : {
            roomId,
            userId,
            role: "USER"
        }
    }).catch((e)=> {
        console.log("error while joining the room -> ",e);
        res.json({message:"Something went wrong"});
    })
    res.json({message:"Successfully joined the room"});
})

userRouter.post('/create-room' , async(req:Request , res:Response) => {
   const {name , map , userId } = req.body;
   const newRoom = await prisma.rooms.create({
    data : {
        name,
        map,
        users : {
            create: {
                userId: userId,
                role: "ADMIN"
            }
        }
    }
   })
    res.json({data:newRoom});
})
