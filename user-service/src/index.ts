import express from 'express'
import dotenv from "dotenv"
import mongoose from 'mongoose'
import userRouter from './route.js'
import cors from 'cors'

dotenv.config()


const connectDb= async()=>{
    try{
        mongoose.connect(process.env.MONGO_URI as string,{
            dbName: "Spotify",
        })
        console.log("MongoDB connected");
        
    }catch(error){
        console.log(error)
    }
}

const app=express()


app.use(cors({
    origin: [
        'https://music-streaming-platform-cyan.vercel.app',
        'https://music-streaming-platform-git-main-saha7s-projects.vercel.app',
        /^https:\/\/music-streaming-platform-.*\.vercel\.app$/ // Matches ALL preview deployments
    ],
    credentials: true
}))

app.use(express.json())

app.use("/api/v1", userRouter)

app.get("/",(req,res)=>{
    res.send("Server is working")
})

const port = process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
    connectDb()
})