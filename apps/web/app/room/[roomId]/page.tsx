"use client"

import { useParams , useRouter } from "next/navigation"
import UserCanvas from "../../components/UserCanvas";
import { useCurrentUser } from "../../hooks/getUserCurrent";

export default function Room() {
    const {roomId} = useParams();
    const router = useRouter();
    const {user , loading} = useCurrentUser();
    if(loading) {
        return <div>Loading...</div>
    }
    if(!user) {
        router.push('/login');
    }
    return (
        <div>
           <UserCanvas roomId = {roomId as string} user = {user}  />
        </div>
    )
}