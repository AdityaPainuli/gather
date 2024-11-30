"use client"
import { useRouter } from "next/navigation";
import { RoomCreator } from "../components/RoomCreator";
import { useCurrentUser } from "../hooks/getUserCurrent";
import LoadingSpinner from "../components/loader";


export default  function CreateRoom() {
    const {user , loading} =  useCurrentUser();
    const router = useRouter();
    console.log(user);
    if (loading) return <div className="w-full h-screen flex justify-center items-center">
    
    <LoadingSpinner/>
  </div>;
    if(!user) {
        router.push("/login");
        return
    }
    return (
        <div>
            <RoomCreator user = {user} />
        </div> 
    )
}