"use client";

import { useParams, useRouter } from "next/navigation";
import UserCanvas from "../../components/UserCanvas";
import { useCurrentUser } from "../../hooks/getUserCurrent";
import { useEffect } from "react";
import LoadingSpinner from '../../components/loader';

export default function Room() {
  const { roomId }: {roomId:string} = useParams();
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }

  }, [loading, user, router]);

  useEffect(() => {
    if(!user) return;
    const isValidUser = user.roomRoles.some((room) => room.room.id === roomId);
    if(!isValidUser) {
     router.push('/');
    }
  },[user]);

  if (loading) return <div className="w-full h-screen flex justify-center items-center">
    
    <LoadingSpinner/>
  </div>;

  if (!user) {
    return null;
  }

  else {
    console.log("running" , user);
  
   
  return (
    <div>
      <UserCanvas roomId={String(roomId)} user={user} />
    </div>
  );
}
}
