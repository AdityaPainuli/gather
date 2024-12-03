interface User {
    id:string,
    name:string,
    posX:number,
    posY:number,
    socket:WebSocket,
    roomRoles:RoomUser[],
}

interface Obstacle {
    id:string,
    width:number,
    height:number,
    posX:number,
    posY:number
}

interface Room {
    id:string , 
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
