"use client";
import { useRouter } from "next/navigation";
import "./globals.css";
import { useCurrentUser } from "./hooks/getUserCurrent";
import { useEffect, useState } from "react";
import { Copy, Trash, UserPlus } from "lucide-react";
import { validateEmail } from "../utils/email";
import LoadingSpinner from "./components/loader";

export default function Home() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();

  const [rooms, setRooms] = useState<RoomUser[] | null>(null);

 
  const handleAddUserToRoom = async (roomId:string) => {
    // for current implementation we have a simple loader to show the process is going on for adding a user.
    const email  = prompt("Please enter user email");

    if (!email) {
      alert("No email provided.")
      return;
    }

    if (!validateEmail(email)) {
      alert("Not a valid email");
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/room/join-room', {
        method:"POST",
        headers: {
          'Content-type':"application/json"
        },
        body:JSON.stringify({user , joinerUserEmail:email , roomId:roomId})
      })
      if (!response.ok) {
        const error = await response.json();
        console.log(error.message);
        alert("An error occured while adding user to room");
        return;
      }

      alert("User invited successfully!");
    } catch (error) {
      console.error("Error adding user to room:", error);
      alert("An error occurred while adding user to room");
    }
  };

  async function handleDeletingRoom(roomId: string): Promise<void> {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not correctly authorized. Please re-login again!");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/api/room/${roomId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error("Error deleting room:", error);
        alert("Failed to delete room. Please try again.");
        return;
      }
  
      alert("Successfully deleted room.");
      setRooms((currentRooms) =>
        currentRooms?.filter(({ room }) => room.id !== roomId) ?? []
      );
      
    } catch (error) {
      console.error(
        `Something went wrong while deleting room with roomId: ${roomId}`,
        error
      );
      alert("An error occurred while deleting the room. Please try again.");
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      setRooms(user.roomRoles);
      console.log(user.roomRoles);
    }
  }, [user]);

  if (loading) return <div className="w-full h-screen flex justify-center items-center">
    
    <LoadingSpinner/>
  </div>;
  if (!user) return null; 

  return (
   <div className="w-[80%] relative z- mt-4 mx-auto flex flex-col space-y-8">
    <div className="flex justify-between items-center my-4 ">
    <h1 className="text-5xl font-bold " >My spaces 🍊</h1>
    <button className="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-md" onClick={()=> router.push('/room')}>Create new space 🍊 </button>
    </div>
     <div className="grid grid-cols-3 gap-6">
     
  {rooms?.map(({ room, role }, index) => (
  <div
    key={index}
    className="border border-black shadow-md rounded-md p-4 cursor-pointer hover:scale-105 transition-all flex flex-col space-y-3"
  >
    <div className="flex justify-between items-center">
      <h1 className="font-semibold text-xl">{room.name}</h1>
      <div className="flex space-x-2 items-center">
        <button className="p-2  bg-orange-500 hover:bg-orange-600 text-white rounded-md">
          <Copy color="white" size={15} />
        </button>
        <button
          onClick={() => handleDeletingRoom(room.id)}
          className="p-2  bg-orange-500 hover:bg-orange-600 text-white rounded-md"
        >
          <Trash color="white" size = {15} />
        </button>
        <button
          onClick={() => {
            handleAddUserToRoom(room.id);
          }}
          className="p-2  bg-orange-500 hover:bg-orange-600 text-white rounded-md"
        >
          <UserPlus color="white" size = {15} />
        </button>
      </div>
    </div>
    <span className="text-sm">
      Created at: <code>{new Date(room.created_at).toLocaleDateString()}</code>
    </span>
    <div>
      <p>
        Role: <span className="font-semibold">{role}</span>
      </p>
      <p>
        Total users: <span className="font-semibold">{room.users.length}</span>
      </p>
      <p>
        Online users: <span className="font-semibold">0</span>
      </p>
    </div>
    <div>
      <button onClick={() => router.push(`/room/${room.id}`)}
 className="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-md">
        Enter space ➡️
      </button>
    </div>
  </div>
))}

   </div>
{/* 
 <ModalComponent isOpen={showModal} onClose={() => setShowModal(false)}>
    <div className="p-6 bg-red-500 space-y-4 z-[2]">
      <h2 className="text-2xl font-bold text-gray-800">
        Add user email for adding them to your space
      </h2>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input 
          type="email" 
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError('');
          }}
          placeholder="Enter user's email" 
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        {emailError && (
          <p className="text-red-500 text-sm mt-1">{emailError}</p>
        )}
      </div>
      <button 
        onClick={handleAddUserToRoom}
        className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
      >
        Enter Space
      </button>
    </div>
   </ModalComponent> */}
 </div>
  
  );
}
