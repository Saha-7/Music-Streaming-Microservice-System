import express from "express"
import dotenv from "dotenv"
import songRoutes from "./route.js"
import redis from "redis"
import cors from 'cors'


dotenv.config()

export const redisClient = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-14399.crce217.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 14399
    }
})

redisClient.connect().then(()=>console.log("Connected to Redis")).catch(console.error)




const app = express()

app.use(cors({
    origin: [
        'https://music-streaming-platform-cyan.vercel.app',
        'https://music-streaming-platform-git-main-saha7s-projects.vercel.app',
        /^https:\/\/music-streaming-platform-.*\.vercel\.app$/
    ],
    credentials: true
}))

app.use(express.json())

const port = process.env.PORT

app.use("/api/v1", songRoutes)

app.listen(port,()=>{
    console.log(`song service running on port ${port}`)
})