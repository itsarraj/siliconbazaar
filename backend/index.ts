import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { createApp } from "./app.js";

const app = createApp();
const uploadsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "uploads");
app.use("/uploads", express.static(uploadsDir));
const PORT = process.env.PORT || 9002;
const MODE = process.env.NODE_ENV;

app.listen(PORT, () => {
  console.log(`Server running in ${MODE} mode on port ${PORT}`);
});
