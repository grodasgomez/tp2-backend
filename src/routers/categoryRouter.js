import express from "express";
import { createHandler } from "../utils/index.js";
import {
  getAll,
  create,
  update,
  destroy,
} from "../handlers/categoryHandler.js";

const router = express.Router();

router.get("/", createHandler(getAll));

router.post("/", createHandler(create));

router.put("/:id", createHandler(update));

router.delete("/:id", createHandler(destroy));

export default router;
