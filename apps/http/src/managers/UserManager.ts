

export class UserManager {
    public Users:User[] = [];


    addUser(id:string , initialPosx:number , initialPosy:number , socket:WebSocket) {
        const exisitingUser = this.Users.find((u) => u.id === id);
        if(exisitingUser) {
            throw new Error("User already exist");
        }
        this.Users.push({id,posX:initialPosx, posY:initialPosy , socket});
    }

  

};