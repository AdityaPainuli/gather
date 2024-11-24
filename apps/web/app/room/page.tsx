"use client"
import { useRouter } from "next/navigation";
import { RoomCreator } from "../components/RoomCreator";
import { useCurrentUser } from "../hooks/getUserCurrent";

export default  function CreateRoom() {
    const {user , loading} =  useCurrentUser();
    const router = useRouter();
    console.log(user);
    if(loading) return <div>Loading...</div>
    if(!user) {
        router.push("/login");
        return
    }
    return (
        <div>
            <h1 className = "text-black">Room creation</h1>
            <RoomCreator user = {user} />
        </div> 
    )
}