import express from "express";
import cors from 'cors';
import { userRouter } from "./routes/userRoutes";
import routes from "./routes";
import dotenv from 'dotenv';


const app = express();
const PORT = process.env.port || 8080;

app.use(cors());
app.use(express.json());
const envResult = dotenv.config()
if(envResult.error) {
    console.error("Env is not found.")
}


app.use("/api",routes);


app.listen(PORT,() => {
    console.log("Server is listening on port 8080");
});

