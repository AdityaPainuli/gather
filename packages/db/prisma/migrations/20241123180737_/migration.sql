/*
  Warnings:

  - A unique constraint covering the columns `[role,userId,roomId]` on the table `RoomUser` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "RoomUser_userId_roomId_key";

-- CreateIndex
CREATE UNIQUE INDEX "RoomUser_role_userId_roomId_key" ON "RoomUser"("role", "userId", "roomId");
