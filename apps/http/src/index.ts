import express from "express";
import cors from 'cors';
import { userRouter } from "./routes/userRoutes";
import routes from "./routes";


const app = express();
const PORT = process.env.port || 8080;

app.use(cors());
app.use(express.json());

app.use("/api",routes);


app.listen(PORT,() => {
    console.log("Server is listening on port 8080");
});

