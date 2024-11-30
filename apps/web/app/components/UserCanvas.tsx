"use client"
import React, { useEffect, useRef, useState } from 'react';

const UserCanvas = ({roomId , user}: {roomId:string , user:User | null}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

 
  const [currentUser , setCurrentUser] = useState<User | null>(user);
  const [room , setRoom] = useState<Room | null>();

  const dotRadius = 10; 

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      setCurrentUser((user) => {
        if(!user) return user;
        return {
          ...user,
          posX: Math.min(user.posX , canvas.width - dotRadius),
          posY: Math.min(user.posY , canvas.height - dotRadius)
        }
      })
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if(!currentUser || !room) return;
    const step = 10;
    let {posX , posY} = currentUser;

    switch(e.key) {
      case "ArrowUp":
        posY = Math.max(posY - step, dotRadius);
        break;
      case "ArrowDown":
        posY = Math.min(posY + step, window.innerHeight - dotRadius);
        break;
      case "ArrowLeft":
        posX = Math.max(posX - step, dotRadius);
        break;
      case "ArrowRight":
        posX = Math.min(posX + step, window.innerWidth - dotRadius);
        break;
    }
    const updatedUser = {...currentUser, posX , posY};
    setCurrentUser(updatedUser);

    currentUser.socket.send(JSON.stringify({
      type:"updateUser",
      userId:currentUser.id,
      roomId:room.id,
      posX:currentUser.posX,
      posY:currentUser.posY
    }));

    setRoom((prev)=> {
      if(!prev) return null;
      return {
        ...prev,
        users: prev.users.map((u)=> u.id === currentUser.id ? updatedUser : u)
      }
    })
  };

  const handleSocketMessage = (message:MessageEvent) => {
    const data = JSON.parse(message.data);
    if(data.type === "positionUpdate" && room){
      setRoom((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          users: prev.users.map((user) =>
            user.id === data.userId
              ? { ...user, posX: data.posX, posY: data.posY }
              : user
          ),
        };
      });
    }
  }

  const draw = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);


        // drawing of obstacles.
        room?.map.forEach((obstacle)=> {
          ctx.fillStyle = "gray";
          ctx.fillRect(obstacle.posX , obstacle.posY , obstacle.width , obstacle.height);
        })

        // drawing of users.
        room?.users?.forEach((user)=> {
          ctx.beginPath();
          ctx.arc(user.posX , user.posY , dotRadius , 0 , Math.PI * 2);
          ctx.fillStyle = user.id ? 'blue': 'red';
          ctx.fill();
          ctx.closePath();
        })

       if(currentUser) {
          ctx.beginPath();
          ctx.arc(currentUser.posX, currentUser.posY, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = "red"; 
          ctx.fill();
          ctx.closePath();
       }
      }
    }
  };

  const fetchRandomPosition = async() => {
    if(!currentUser || !room) return;
    try {
      const req=  await fetch('http://localhost:8080/api/room/random-position', {
        method: "POST",
        headers: {
          'Content-type':'application/json'
        },
        body: JSON.stringify({ user:currentUser , room , windowWidth:window.innerWidth , windowHeight:window.innerHeight })
      });
     
      const {message,data:updatedUser} = await req.json();
      setCurrentUser((prevUser) => {
        if(!prevUser) return prevUser;
        return {
          ...prevUser,
          posX:updatedUser.posX,
          posY:updatedUser.posY
        }
      });
      draw();
   
     
    }catch(e) {
      console.log("Error ->",e);
    } 
  }


 useEffect(() => {
  if(room) {
    fetchRandomPosition();
  }
 },[room]);

 useEffect(() => {
  draw();
 },[room,currentUser]);



  useEffect(() => {
    const fetchRoom = async() => {
      const req = await fetch(`http://localhost:8080/api/room/${roomId}`);
      const {data}: {data:Room} = await req.json();
      setRoom(data);
      console.log(data)

      if(!currentUser) return;
      setCurrentUser((u) => {
        if(!u) return null;
        return {...u , socket: new WebSocket("wss://localhost:8081")}
      })
      // currentUser.socket.onmessage = handleSocketMessage;
      setCurrentUser(currentUser)
    }

   
    fetchRoom();
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas); 
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'lightgray', 
      }}
    />
  );
};

export default UserCanvas;
