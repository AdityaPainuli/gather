"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { generateRandomId } from "../../utils/randomId";

export function UpdatingRoom({ user,room }: { user: User , room:Room }) {
  const [roomName, setRoomName] = useState(room.name);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [obstacles, setObstacles] = useState<Obstacle[]>(room.map);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentObstacle, setCurrentObstacle] = useState<Obstacle | null>(null);
  const [selectedObstacleIndex, setSelectedObstacleIndex] = useState<number | null>(null);
  const router = useRouter();

  function resizeCanvas() {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  function draw() {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw existing obstacles
        obstacles.forEach((obs, index) => {
          ctx.fillStyle = selectedObstacleIndex === index ? "blue" : "black"; // Highlight selected obstacle
          ctx.fillRect(obs.posX, obs.posY, obs.width, obs.height);
        });

        // Draw current obstacle if any
        if (currentObstacle) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          ctx.fillRect(
            currentObstacle.posX,
            currentObstacle.posY,
            currentObstacle.width,
            currentObstacle.height
          );
        }
      }
    }
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const clickedObstacleIndex = obstacles.findIndex(
        (obs) =>
          mouseX >= obs.posX &&
          mouseX <= obs.posX + obs.width &&
          mouseY >= obs.posY &&
          mouseY <= obs.posY + obs.height
      );

      if (clickedObstacleIndex !== -1) {
        setSelectedObstacleIndex(clickedObstacleIndex);
      } else {
        setIsDrawing(true);
        setCurrentObstacle({
            id:generateRandomId(),
            posX:e.clientX,
            posY:e.clientY,
            height:0,
            width:0
        });
        setSelectedObstacleIndex(null); 
      }
    }
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing || !currentObstacle) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const width = e.clientX - rect.left - currentObstacle.posX;
      const height = e.clientY - rect.top - currentObstacle.posY;
      setCurrentObstacle({ ...currentObstacle, width, height });
    }
  }

  function handleMouseUp() {
    if (currentObstacle) {
      setObstacles((prevObstacles) => [...prevObstacles, currentObstacle]);
    }
    setIsDrawing(false);
    setCurrentObstacle(null);
  }

  function handleKeyDown(e: KeyboardEvent) {
    console.log("key-down",selectedObstacleIndex,e.key);
    if (e.key === "Backspace" && selectedObstacleIndex !== null) {
      setObstacles((prevObstacles) =>
        prevObstacles.filter((_, index) => index !== selectedObstacleIndex)
      );
      
      setSelectedObstacleIndex(null);
    }
    if (e.key === "Escape") {
        console.log("espace");
        setSelectedObstacleIndex(null);
    }
  }

  function handleObstacleUpdate(
    index: number,
    updatedProperties: Partial<Obstacle>
  ) {
    setObstacles((prevObstacles) =>
      prevObstacles.map((obs, i) =>
        i === index ? { ...obs, ...updatedProperties } : obs
      )
    );
  }

  async function handleSaveRoom() {
    if (!roomName) {
      alert("Please give the room a name");
      return;
    }
    try {
      const req = await fetch("http://localhost:8080/api/room", {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name: roomName, map: obstacles, roomId:room.id }),
      });
      const { data : updatedRoom }: { data: Room } = await req.json();
      setObstacles(() => updatedRoom.map);
      setRoomName(() => updatedRoom.name);
      alert("Room is successfully updated");
      router.push("/");
    } catch (e) {
      console.log(e);
      alert("Room is not saving.");
    }
  }

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedObstacleIndex]);

  useEffect(() => {
    draw();
  }, [obstacles, currentObstacle, selectedObstacleIndex]);

  return (
    <div>
      <h1>Hello world</h1>
      <canvas
        ref={canvasRef}
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
        <button
          onClick={handleSaveRoom}
          style={{ padding: "5px 10px " }}
          className="bg-orange-600 text-white rounded-md cursor-pointer hover:bg-orange-700"
        >
          Save Room
        </button>
        {selectedObstacleIndex !== null && (
          <div style={{ marginTop: "10px" }}>
            <h3>Edit Obstacle</h3>
            <label>
              X:
              <input
                type="number"
                value={obstacles[selectedObstacleIndex]?.posX || ""}
                onChange={(e) =>
                  handleObstacleUpdate(selectedObstacleIndex, {
                    posX: parseInt(e.target.value, 10),
                  })
                }
              />
            </label>
            <label>
              Y:
              <input
                type="number"
                value={obstacles[selectedObstacleIndex]?.posY || ""}
                onChange={(e) =>
                  handleObstacleUpdate(selectedObstacleIndex, {
                    posY: parseInt(e.target.value, 10),
                  })
                }
              />
            </label>
            <label>
              Width:
              <input
                type="number"
                value={obstacles[selectedObstacleIndex]?.width || ""}
                onChange={(e) =>
                  handleObstacleUpdate(selectedObstacleIndex, {
                    width: parseInt(e.target.value, 10),
                  })
                }
              />
            </label>
            <label>
              Height:
              <input
                type="number"
                value={obstacles[selectedObstacleIndex]?.height || ""}
                onChange={(e) =>
                  handleObstacleUpdate(selectedObstacleIndex, {
                    height: parseInt(e.target.value, 10),
                  })
                }
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
