import { Request, Response, Router } from "express";
import prisma from '@repo/db/client';
import { getUserFromToken } from "../middleware/userInfo";
import { UserInfoRequest } from "../types";
import { GameEngine } from "../engine/GameEngine";

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
            include: {
                users: true
            }
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

roomRouter.get('/:roomId/user-info', async (req: Request, res: Response) => {
    const { roomId } = req.query;
    const userInsideRoom = await prisma.roomUser.findMany({
        where: {
            roomId: roomId as string
        },
        select: {
            user: true
        }
    })
    if (userInsideRoom.length === 0) {
        res.json({ message: "No user found" })
    }
    res.status(200).json({ data: userInsideRoom });
})

roomRouter.delete('/:roomId', getUserFromToken, async (req: UserInfoRequest, res: Response) => {
    const { roomId } = req.params;

    if (!req.user) {
        res.status(401).json({ message: "User not found" });
    }

    try {
        const roomUser = await prisma.roomUser.findUnique({
            where: {
                role_userId_roomId: {
                    roomId: roomId as string,
                    userId: req.user.id,
                    role: "ADMIN",
                },
            },
        });

        if (!roomUser) {
            res.status(404).json({ message: "Room or admin role not found" });
        }

        // Delete all associated RoomUser records
        await prisma.roomUser.deleteMany({
            where: { roomId },
        });

        // Delete the room itself
        await prisma.rooms.delete({
            where: { id: roomId },
        });

        res.status(200).json({ message: "Successfully deleted the room." });
    } catch (e) {
        console.error("Error ->", e);
        res.status(500).json({ message: "Something went wrong" });
    }
});


roomRouter.post('/random-position', (req: Request, res: Response) => {
    const { user, windowHeight, windowWidth, room } = req.body;
    if (!user || !windowHeight || !windowWidth || !room) {
        throw Error("Missing required fields");
    }
    const updatedUser = GameEngine.getInstance().randomSpawning(room, user, windowHeight, windowHeight);
    res.status(200).json({ data: updatedUser })
})


roomRouter.post('/join-room', async (req: Request, res: Response) => {
    const { user, joinerUserEmail, roomId, role } = req.body;
    if (!user || !joinerUserEmail || !roomId) {
        throw Error("Missing required fields");
    }
    try {
        const exisitingJoiningUser = await prisma.user.findUnique({
            where: {
                email: joinerUserEmail
            }
        });
        if (!exisitingJoiningUser) {
           throw Error("Email does not exists.")
        }

        const joiningUser = await prisma.roomUser.create({
            data: {
                userId: exisitingJoiningUser?.id,
                roomId: roomId,
                role: role ?? "USER"
            }
        });
        res.status(200).json({ message: "Success", data: joiningUser })
    } catch (e) {
        res.status(500).json({ message: "Internal server error", data: null });
    }
});

roomRouter.patch('/', async(req:Request, res:Response):Promise<void> => {
    const {name , map , roomId} =  req.body;
    if(!name ||  !map && !roomId) {
        res.status(400).json({message:"Missing required fields"});
    }
    try {
        const updatedRoom  = await prisma.rooms.update({
            where: {
                id:roomId
            },
            data: {
                name:name,
                map:map
            }
        })
        res.status(200).json({message:"Updated data successfully",data:updatedRoom});
    }catch(e) {
        console.log(e);
        res.status(500).json({message:"Internal server error"});
    }
})


export default roomRouter;

