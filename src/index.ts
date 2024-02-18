import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generateId } from "./utils/helper";
import path from "path";
import { getAllFiles } from "./file";
import { uploadFile } from "./aws";
import * as redis from "redis";
import RedisClient from "@redis/client/dist/lib/client";
import Redis from "ioredis";

// Create a Redis client
// let publisher: any;
// publisher = redis.createClient();

// (async () => {
//   try {
//     publisher.on("connect", () => {
//       console.log("Connected to Redis12345");
//     });
//     await publisher.connect();
//     console.log("Hi");
//   } catch (error) {
//     console.log("Err");
//   }
// })();

const app = express();
app.use(cors());
app.use(express.json());
const redisClient = new Redis({
  port: 6379,
});

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.url;
  const id = "CprR0" || generateId(); // Use generated ID
  // const repoClone = await simpleGit().clone(
  //   repoUrl,
  //   path.join(__dirname, `./output/${id}`)
  // );
  const files = getAllFiles(path.join(__dirname, `output/${id}`));
  try {
    await Promise.all(
      files.map(async (file) => {
        await uploadFile(file.slice(__dirname.length + 1), file);
      })
    );
    console.log("hiiiiii");
    redisClient.lpush("build-queue", id);
    const popedItem = redisClient.lpop("build-queue");
    console.log("Poped item:", popedItem);
    res.json(id);
  } catch (error) {
    console.error("Deployment error:", error);
    res.status(500).json({ error: "Deployment failed" });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
