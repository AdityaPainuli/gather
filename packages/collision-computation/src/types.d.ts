interface SpaceMap {
    id:string , 
    map: Obstacle[]
}

interface Obstacle {
    id:string,
    posX:number,
    posY:number,
    height:number,
    width:number
}

interface user {
    id:string,
    posX:number,
    posY:number
}