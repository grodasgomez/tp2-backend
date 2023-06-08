import express from "express";
import { createHandler } from "../utils/index.js";
import {
  getAll,
  create,
  update,
  destroy,
  getByTableId,
} from "../handlers/consumptionHandler.js";

const router = express.Router();

router.get("/", createHandler(getAll));

router.get("/:id", createHandler(getByTableId));

router.post("/", createHandler(create));

router.put("/:id", createHandler(update));

router.delete("/:id", createHandler(destroy));

export default router;
