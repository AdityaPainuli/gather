"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleLogin() {
    try {
      const req = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const { token } = await req.json();
      localStorage.setItem('token', token);
      router.push('/');
    } catch (e) {
      console.log(e);
      alert("User doesn't exists.");
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-orange-400 to-orange-600">
      <div className="bg-white shadow-2xl rounded-lg w-full max-w-md px-8 py-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome back!</h1>
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-3 rounded-md bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-3 rounded-md bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-md"
        >
          Sign In
        </button>
        <p className="mt-4 text-gray-700 text-center">
          Don't have an account?{' '}
          <a href="/register" className="text-orange-500 hover:text-orange-600 font-medium">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;