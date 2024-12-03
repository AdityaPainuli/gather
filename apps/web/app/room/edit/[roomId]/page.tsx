"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "@repo/ui/loader";
import { UpdatingRoom } from "../../../components/UpdatingRoom";
import { useCurrentUser } from "../../../hooks/getUserCurrent";

function EditRoom() {
  const { roomId } = useParams();
  const [room, setRoom] = useState<Room>();
  const [loading , setLoading] = useState(false);
  const router = useRouter();
  const {user} = useCurrentUser()
  async function fetchRoomDetails() {
    setLoading(() => true);
    const req = await fetch(`http://localhost:8080/api/room/${roomId}`, {
      method: "GET", 
      headers: {
        "Content-type": "application/json",
      },
    });
    const { data }: { data: Room } = await req.json();
    console.log(data);
    if(data === undefined) {
      router.push('/');
      return;
    }
    setRoom(data);
    setLoading(false);
  }
  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  if (loading && room === undefined) 
  return <div className="w-full h-screen flex justify-center items-center">
  <LoadingSpinner/>
  </div>;
  if (room === undefined || !user ) {
    return <div>Room is not defined.</div>
  }
  {
    return (
      <div>
        <UpdatingRoom room={room}  user = {user}/>
      </div>
    );
  }
}

export default EditRoom;
