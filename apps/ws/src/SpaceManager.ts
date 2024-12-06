import type { User } from "./User";

export class SpaceManager{
    public space: Map<string,User[]> = new Map();
    static instance:SpaceManager;

    private constructor() {
        this.space = new Map()
    }

    public static getInstane():SpaceManager {
        if(!this.instance) {
            this.instance = new SpaceManager();
        }
        return this.instance;
    }

    public addUser(spaceId: string, user: User) {
        if (!this.space.has(spaceId)) {
            this.space.set(spaceId, [user]);
            return;
        }
        this.space.set(spaceId, [...(this.space.get(spaceId) ?? []), user]);
    }

    public removeUser(spaceId:string , userId:string){
        if(!this.space.has(spaceId)) {
            return
        }
       this.space.set(spaceId,this.space.get(spaceId)?.filter(u => u.userId !== userId) ?? []);
    }

    public broadcastMessage(spaceId:string , OutgoingMessage:any,userId:string) {
        if(!this.space.has(spaceId)) {
            return false
        }
        this.space.get(spaceId)?.forEach((user)=> {
           if(user.userId !== userId){
                user.ws.send(JSON.stringify(OutgoingMessage))
           }
        })
    } 

}