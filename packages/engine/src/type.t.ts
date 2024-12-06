
interface User {
    id:string,
    posX:number,
    posY:number,
    socket:WebSocket // for sending them notifications and messages.

}

// rectangle/sqare shapes only 
interface Obstacle {
    width:number,
    height:number,
    posX:number,
    posY:number
}

interface Room {
    roomId:string,
    roomName:string, 
    users:User[],
    map:Obstacle[]
}

interface UserInfoRequest extends Request {
    user?: any
}