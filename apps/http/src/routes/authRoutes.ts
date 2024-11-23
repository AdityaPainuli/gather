import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "@repo/db/client";
import bcrypt from "bcrypt";

const authRouter = Router();

const generateAccessToken = (user: { id: string; email: string; name: string }) => {
  return jwt.sign(user, process.env.TOKEN_SECRET as string, { expiresIn: "1h" });
};

authRouter.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { email, password, userName } = req.body;

  if (!email || !password || !userName) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name: userName,
        email,
        hashPassword: hashedPassword,
      },
    });

    const token = generateAccessToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    res.status(201).json({ message: "User created successfully", data: newUser, token });
  } catch (error) {
    console.error("Error ->", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

authRouter.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      res.status(404).json({ message: "User doesn't exist" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashPassword);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error ->", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default authRouter;
