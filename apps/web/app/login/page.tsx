"use client"
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function login() {
    const [email , setEmail] = useState<string>("");
    const [password , setPassword] = useState("");
    const router = useRouter();
    async function handleLogin() {
       try {
        console.log("running this function")
        const req = await fetch('http://localhost:8080/api/auth/login', {
            method:"POST",
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify({email , password})
        });
        const {token} = await req.json();
        localStorage.setItem("token",token);
        router.push('/');
       }catch(e) {
        console.log(e);
        alert("User doesn't exists.")
       }
    }
    return (
        <div>
            <input type = "email" placeholder="Email" value = {email} onChange={(e)=> setEmail(e.target.value)} />
            <input type = "password" placeholder="Password" value = {password} onChange={(e)=> setPassword(e.target.value)}/>
            <div>
                <button onClick={()=> handleLogin()}>Login</button>
                <button onClick={() => router.push('/register')}>Register</button>    
            </div> 
        </div>
    )
}