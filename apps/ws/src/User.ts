import {WebSocket} from "ws";
import { SpaceManager } from "./SpaceManager";
import jwt, { JwtPayload } from 'jsonwebtoken';
import {GameEngine} from '@repo/engine/src/GameEngine';
import prisma from '@repo/db/src/client'


function generateRandomId():string {
    return Math.random().toString(36).substring(7);
}

const SPEED = 10;

export class User {
    public id: string;
    public userId?: string;
    private spaceId?: string;
    private x: number;
    private y: number;
    public ws: WebSocket;

    constructor(ws: WebSocket) {
        this.id = generateRandomId();
        this.x = 0;
        this.y = 0;
        this.ws = ws;
        this.initHandlers();
    }

    initHandlers() {
        this.ws.on("message", async (data) => {
            console.log(data)
            const parsedData = JSON.parse(data.toString());
            console.log(parsedData)
            console.log("parsedData")
            switch (parsedData.type) {
                case "join":
                    console.log("jouin receiverdfd")
                    const spaceId = parsedData.payload.spaceId;
                    const token = parsedData.payload.token;
                    const windowWidth = parsedData.payload.width;
                    const windowHeight = parsedData.payload.height;
                    const userId = (jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayload).userId
                    if (!userId) {
                        this.ws.close()
                        return
                    }
                    const space = await prisma.rooms.findUnique({
                        where: {
                            id:spaceId
                        }
                    });

                    const user = await prisma.user.findUnique({
                        where: {
                            id:this.userId 
                        }
                    });
                    if(!user) {
                        console.log("No user found...");
                        this.ws.close();
                        return;
                    }
                 
                    if(!space) {
                        console.log("No space found..")
                        this.ws.close();
                        return;
                    }
                    this.spaceId = spaceId;
                    SpaceManager.getInstane().addUser(spaceId , this);
                    const {posX , posY} = GameEngine.getInstance().randomSpawning(space,user,windowHeight,windowWidth);
                    console.log(`Spawning new user with id ${this.userId} on X:${this.x} and Y:${this.y}`);
                    this.x = posX;
                    this.y = posY;
                    SpaceManager.getInstane().broadcastMessage(this.spaceId as string, {type:"user-joined",payload : { x: this.x , y: this.y}},this.userId as string)
                case "move":
                    const predictedX = parsedData.payload.predictedX;
                    const predictedY = parsedData.payload.predictedY;
                    const displacementX = Math.abs(this.x - predictedX);
                    const displacementY = Math.abs(this.y - predictedY);
                    if((displacementX === SPEED && displacementY === 0) || (displacementX === 0 && displacementY === SPEED)) {
                        this.x = predictedX;
                        this.y = predictedY;
                        SpaceManager.getInstane().broadcastMessage(this.spaceId as string,{
                            type:"movement",
                            payload : {
                                x:this.x,
                                y:this.y
                            }
                        },this.userId as string);
                        return
                    }
                    this.send({type:"movement-rejected",payload: { x: this.x , y: this.y }})
                case "heartbeat":
                    const beat = parsedData.payload.heartbeat;
                    SpaceManager.getInstane().broadcastMessage(this.spaceId as string , {
                        type:"heartbeat",
                        payload : {
                            beat
                        }
                    },this.userId as string)   
            }
        })
    }

    destory() {
        SpaceManager.getInstane().broadcastMessage(this.spaceId as string ,{
            type:"user-left",
            payload : {
                userId: this.userId
            }
        },this.userId as string);
        SpaceManager.getInstane().removeUser(this.spaceId as string,this.userId as string);
    }


    send(OutgoingMessage:any) {
        this.ws.send(JSON.stringify(OutgoingMessage));
    }

}