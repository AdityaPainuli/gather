"use client"
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function register() {
    const [name , setName] = useState("");
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState(""); 
    const router = useRouter();
    async function handleRegister() {
        const req = await fetch('http://localhost:8080/api/auth/register', {
            method: "POST",
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify({email,password,userName:name})
        });
        const {data , token} = await req.json();
        localStorage.setItem("token",token);
        router.push('/login')
    }
    return (
        <div>
            <input type = "text" placeholder="Name" value = {name} onChange={(e)=> setName(e.target.value)} />
            <input type = "email" placeholder="Email" value = {email} onChange={(e)=> setEmail(e.target.value)} />
            <input type = "password" placeholder="Password" value = {password} onChange={(e) => setPassword(e.target.value)} />
            <div>
                <button onClick={(e)=> {handleRegister()}}>Regsiter</button>
                <button onClick={() => router.push('/login')}>Login</button>
            </div>
        </div>
    )
}