import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import adminRoutes from "./route.js"
import cloudinary from 'cloudinary'
import redis from 'redis'
import cors from 'cors'

dotenv.config();

//Redis config.
export const redisClient = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-14399.crce217.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 14399
    }
})

redisClient.connect().then(()=>console.log("Connected to Redis")).catch(console.error)



// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express();

app.use(cors({
    origin: [
        'https://music-streaming-platform-cyan.vercel.app',
        'https://music-streaming-platform-git-main-saha7s-projects.vercel.app',
        /^https:\/\/music-streaming-platform-.*\.vercel\.app$/
    ],
    credentials: true
}))

app.use(express.json());

async function initDB() {
  try {
    await sql`
        CREATE TABLE IF NOT EXISTS albums(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            thumbnail VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;
    await sql`
        CREATE TABLE IF NOT EXISTS songs(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            thumbnail VARCHAR(255),
            audio VARCHAR(255) NOT NULL,
            album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;
    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error initDb", error);
  }
}

app.use("/api/v1", adminRoutes)

const port = process.env.PORT;

initDB().then(() => {
  app.listen(port, () => {
    console.log(`admin-service is running on port ${port}`);
  });
});
