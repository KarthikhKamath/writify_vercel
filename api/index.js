import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import UserRouter from "./Routes/user.js";
import BlogRouter from "./Routes/blog.js";
const app = express();

app.use(cors(
    {
        origin: ["https://deploy-mern-luhg.vercel.app"],
        methods: [POST, "GET"],
        credentiats: true
    }
))
const port = 4000

app.use("/api/user", UserRouter)
app.use("/api/blog", BlogRouter)


app.listen(port, ()=>{
    console.log("App is running on", port)
})

mongoose.connect("mongodb+srv://harowar2002:karthik@cluster0.x0maznw.mongodb.net/?retryWrites=true&w=majority").then(()=>{
    console.log("Db connected")
}) 