"use client";
import { useRouter } from "next/navigation";
import UserCanvas from "./components/UserCanvas";
import "./globals.css";
import { useCurrentUser } from "./hooks/getUserCurrent";
import { useEffect, useState } from "react";
import { Button } from "@repo/ui/button";
import Image from "next/image";
import { Copy } from "lucide-react";

export default function Home() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();

  const [rooms, setRooms] = useState<RoomUser[] | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      // @ts-ignore
      setRooms(user.roomRoles);
    }
  }, [user]);

  if (loading) return <div>Loading</div>;
  if (!user) return null; 

  return (
   <div className="w-[80%] mt-4 mx-auto flex flex-col space-y-8">
    <div className="flex justify-between items-center my-4 ">
    <h1 className="text-5xl font-bold " >My spaces 🍊</h1>
    <button className="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-md  ">Create new space 🍊 </button>
    </div>
     <div key = {"sf"} className="grid grid-cols-3 gap-6">
     
     {rooms?.map((room) => (
       <div  className="border border-black shadow-md rounded-md p-4 cursor-pointer hover:scale-105 transition-all flex flex-col space-y-3" key={room.id}>
        <div className="flex justify-between items-center">
        <h1 className="font-semibold text-xl">{room.room.name}</h1>
        <button className="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-md  ">
          <Copy color = "white" />
        </button>
        </div>
         <span className="text-sm ">
           created at: <code>{new Date(room.room.created_at).toLocaleDateString()}</code>
         </span>
        <div>
            <p>Role: <span className="font-semibold">{room.role}</span></p>
            <p>Online users : <span className="font-semibold">0</span></p>
        </div>
        <div>
          <button className="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-md  ">Enter space ➡️</button>
        </div>
       </div>
     ))}
   </div>
   </div>
  );
}
