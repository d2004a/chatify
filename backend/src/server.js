import express from "express";

import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// import path from "path";



const app = express();
// const __dirname =path.resolve(); // give me the path of my root folder

const PORT = ENV.PORT || 3000;

app.use(express.json()) //req.body
app.use(cookieParser())

app.use(cors({origin:ENV.CLIENT_URL, credentials:true}))


app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)


// make ready for deployment

// if(process.env.NODE_ENV === "production"){
//     app.use(express.static(path.join(__dirname, "../frontend/dist")))

//     app.get("*",(_,res)=>{
//         res.sendFile(path.join(__dirname,"frontend/dist/index.html")); // this will work when any other api hits 
//     })
// }


app.listen(PORT, ()=>{
    console.log("server is running on port " + PORT);
    connectDB()
})