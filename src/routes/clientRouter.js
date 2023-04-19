import express from "express";
import { createHandler } from "../utils/index.js";
import { getAll, create } from "../handlers/clientHandler.js";

const router = express.Router();

router.get("/", createHandler(getAll));

router.post("/", createHandler(create));


export default router;
