import { Request, Response, Router } from "express";

const roomRouter = Router();

roomRouter.get('/:roomId',async(req:Request , res:Response)=> {
    const {roomId} = req.query;
    res.json(`Getting info for roomId ${roomId}`);
})

roomRouter.get('/:roomId/user-info',async(req:Request , res:Response) => {
    const {roomId} = req.query;
    res.json("All user inside room Infomration");
})

roomRouter.delete('/:roomId',async(req:Request , res:Response) => {
    const {roomId} = req.query;
    res.json("Deleting a room");
})

export default roomRouter;

