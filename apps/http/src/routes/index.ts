import { Router } from "express";
import { userRouter } from "./userRoutes";
import authRouter from "./authRoutes";
import roomRouter from "./roomRoutes";

const routes = Router();

routes.use("/user",userRouter);
routes.use('/auth',authRouter);
routes.use('/room',roomRouter);


export default routes; 
