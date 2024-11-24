import { Room, User } from "../types";

export class RoomManager {
    private Rooms: Map<string, Room> = new Map();
    private static instance: RoomManager;

    static getInstance(): RoomManager {
        if (!this.instance) {
            this.instance = new RoomManager();
        }
        return this.instance;
    }

    /**
     * Adds a user to a room
     * @param user User object to be added
     * @param roomId ID of the room to add the user to
     */
    addUserToRoom(user: User, roomId: string): void {
        const room = this.Rooms.get(roomId);

        if (!room) {
            throw new Error(`Room with ID ${roomId} not found`);
        }

        const userExists = room.users.some((u) => u.id === user.id);
        if (userExists) {
            throw new Error(`User with ID ${user.id} is already in the room`);
        }

        room.users.push(user);
    }

    /**
     * Removes a user from a room
     * @param userId ID of the user to remove
     * @param roomId ID of the room to remove the user from
     */
    removeUserFromRoom(userId: string, roomId: string): void {
        const room = this.Rooms.get(roomId);

        if (!room) {
            throw new Error(`Room with ID ${roomId} not found`);
        }

        const userExists = room.users.some((u) => u.id === userId);
        if (!userExists) {
            throw new Error(`User with ID ${userId} not found in room`);
        }

        room.users = room.users.filter((u) => u.id !== userId);
    }

    /**
     * Maps or creates a new room
     * @param roomId @param roomName as string  of the new room
     */
    mapRoom(roomId: string , roomName:string): void {
        if (this.Rooms.has(roomId)) {
            throw new Error(`Room with ID ${roomId} already exists`);
        }

        this.Rooms.set(roomId, { roomId , roomName, users: [] , map:[]  });
    }

    /**
     * Deletes a room
     * @param roomId ID of the room to delete
     */
    deleteRoom(roomId: string): void {
        if (!this.Rooms.has(roomId)) {
            throw new Error(`Room with ID ${roomId} not found`);
        }

        this.Rooms.delete(roomId);
    }

    /**
     * Gets a room by ID
     * @param roomId ID of the room to fetch
     * @returns Room object
     */
    getRoom(roomId: string): Room | null {
        return this.Rooms.get(roomId) || null;
    }


    /**
     * Broadcasting users location of a single room
     * 
     */
    
}
