"use client"

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react"

export function RoomCreator({user}:{user:User}) {
   
    const [roomName , setRoomName] = useState("");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [obstacles , setObstacles] = useState<Obstacle[]>([]);
    const [isDrawing , setIsDrawing] = useState(false);
    const [currentObstacle , setCurrentObstacle] = useState<Obstacle | null>(null);
    const router = useRouter();


    function resizeCanvas() {
        const canvas = canvasRef.current;
        if(canvas) {    
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }
    function draw() {
        const canvas = canvasRef.current;
        if(canvas) {
            const ctx = canvas?.getContext("2d");
            if(ctx) {
                ctx.clearRect(0,0,canvas?.width , canvas?.height);

                 // Draw exisitng shapes.
                obstacles.forEach((obs)=> {
                    ctx.fillStyle = 'black'
                    ctx.fillRect(obs.posX,obs.posY,obs.width,obs.height);
                })
                // Draw current shape if any
                if(currentObstacle) {
                    ctx.fillStyle = "rgba(0,0,0,0.5)";
                    ctx.fillRect(currentObstacle.posX,currentObstacle.posY , currentObstacle.width , currentObstacle.height);
                }

            }

           
        }
    }

    function handleMouseDown(e:React.MouseEvent<HTMLCanvasElement>) {
        setIsDrawing(true);
        const rect = canvasRef.current?.getBoundingClientRect();
        if(rect) {
            console.log("e-clientX ->",e.clientX);
            console.log("e-clientY",e.clientY);
            console.log("rectLeft ->",rect.left);
            console.log("rectRight ->",rect.top);
            setCurrentObstacle({
                posX:e.clientX - rect.left,
                posY:e.clientY - rect.top,
                width: 0,
                height:0
            });
        }

    }

    function handleMouseMove(e:React.MouseEvent<HTMLCanvasElement>) {
        if(!isDrawing || !currentObstacle) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if(rect) {
            const width = e.clientX - rect.left - currentObstacle.posX;
            const height = e.clientY - rect.top - currentObstacle.posY
            setCurrentObstacle({...currentObstacle , width , height})
        }


    }
    function handleMouseUp() {
        if(currentObstacle) {
            setObstacles((prevObstacle)=> [...prevObstacle , currentObstacle]);
        }
        setIsDrawing(false);
        setCurrentObstacle(null);

    }
    async function handleSaveRoom() {
       if(!roomName) {
        alert("Please give the room a name");
        return;
       }
       // wrong api route
      try {
        const req = await fetch('http://localhost:8080/api/user/create-room', {
            method:"POST",
            headers: {
                "Content-type":"application/json"
            },
            body: JSON.stringify({name:roomName , map:obstacles , userId:user.id})
           })
           const {data:room}: {data:Room} = await req.json();
           setObstacles(() => room.map);
           setRoomName(() => room.name);
           alert("Room is successfully created");
           router.push('/');
      }catch(e) {
        console.log(e);
        alert("Room is not saving.")
      }
    }

    useEffect(() => {
        resizeCanvas();
        window.addEventListener("resize",resizeCanvas);

        return() => {
            window.removeEventListener("resize",resizeCanvas);
        }
    },[]);

    // drawing and rending on the screen oin same time
    useEffect(()=> {
        draw();
    },[obstacles , currentObstacle])

    return (
        <div>
            <h1>Hello world</h1>
            <canvas
            ref = {canvasRef}
            style={{
                display: "block",
                position: "fixed",
                top: 0,
                left: 0,
                backgroundColor: "lightgray",
              }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            />
              <div
        style={{
          position: "fixed",
          top: 10,
          left: 10,
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
        }}
      >
        <input
          type="text"
          placeholder="Enter room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
        />
        <button onClick={handleSaveRoom} style={{ padding: "5px 10px " }} className="bg-orange-600 text-white rounded-md cursor-pointer hover:bg-orange-700">
          Save Room
        </button>
      </div>
        </div>
    )
}