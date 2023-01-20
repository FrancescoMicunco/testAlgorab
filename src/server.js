import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

const server = express();
const port = process.env.PORT || 3000;

// ========= middlewares ============
server.use(cors());
server.use(express.json());

// ========= Endpoints ==========

// ========= Connections ========

mongoose.connect(
    process.env.MONGO_CONNECTION_STRING || "mongodb://localhost:27017"
);

mongoose.connection.on("connected", () =>
    server.listen(port, () => console.log("server connected on port: ", port))
);

mongoose.connection.on("error", () => {
    console.log("impossible to connect Database");
});