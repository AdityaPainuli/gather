interface User {
    id:string,
    name:string,
    posX:number,
    posY:number,
    socket:WebSocket,
    roomsUser:RoomUser[]
}

interface Obstacle {
    width:number,
    height:number,
    posX:number,
    posY:number
}

interface Room {
    roomId:string , 
    name:string,
    users:User[],
    map:Obstacle[],
    created_at:Date,
    updated_at:Date
}



interface RoomUser {
    id:string , 
    userId: string,
    roomId:string,
    role:"ADMIN" | "USER",
    room:Room
}
