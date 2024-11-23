import { NextFunction, Request , Response } from "express";
import jwt from 'jsonwebtoken';
import { UserInfoRequest } from "../types";




export async function getUserFromToken(req:UserInfoRequest , res:Response , next:NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) {
        res.status(401).json({message:"token is requried"});
    }
    try {
        const user = jwt.verify(token as string , process.env.TOKEN_SECRET as string);
        req.user = user;
        next();

    }catch(e) {
        res.status(401).json({message:"Invalid or expired token"});
    }
}