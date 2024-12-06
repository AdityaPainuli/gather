export class GameEngine {
    // emitting location of every user in the room to ther user
    // handling location and collision of user with object and other user
    // handling misc game logic

    public static instance:GameEngine;

    static getInstance():GameEngine {
        if(!this.instance) {
            this.instance = new GameEngine();
        }
        return this.instance;
    }

     /**
     * Spawns a user at a random position that does not overlap with obstacles on the map.
     * @param room The room containing the map and obstacles.
     * @param user The user to be spawned.
     * @param windowHeight The height of the game window.
     * @param windowWidth The width of the game window.
     * @returns Updated user object with a valid spawn position.
     */
    randomSpawning(room:Room , user:User , windowHeight:number , windowWidth:number) : Partial<User> {
        console.log(room.map); // [width:number , height:number , posx: number , posy:number][] 
        const map = room.map;;
       
        let spawnX:number;
        let spawnY:number;
        let maxAttempts = 1000;
        do {
            spawnX = Math.floor(Math.random() * windowWidth);
            spawnY = Math.floor(Math.random() * windowHeight);
        }while (!this.isPositionValid(spawnX , spawnY, map) && maxAttempts > 0) {
            if (maxAttempts === 0) {
                console.error("Unable to find user random position on map");
                return user;
            }
        }
        return {
            ...user,
            posX: spawnX,
            posY: spawnY
        };
    }

    userMovement(roomId:string , user:User) {

    }

    /**  
    * Checks user new position is valid or not. 
    * @params x : new position of the player 
    * @params y : new Y-position of theb player.
    * @params map : contains obstacles at different x and y with different width and height.
    * @returns boolean value based on isPositionValid or not 
    */
    isPositionValid(x:number , y:number , map : {posX:number , posY:number , height:number , width:number}[]) : boolean {
        return !map.some(obstacle => {
            return (
                 x > obstacle.posX && x <= obstacle.posX + obstacle.width && y > obstacle.posY && y <= obstacle.posY + obstacle.height
            )
        })
    }

}