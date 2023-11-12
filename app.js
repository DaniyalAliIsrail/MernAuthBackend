import express  from "express";
import ("./db/conn.js")
import router from "./routes/router.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

app.use(router)

app.listen(PORT , ()=>{
        console.log(`server is connected on : ${PORT}`);
})