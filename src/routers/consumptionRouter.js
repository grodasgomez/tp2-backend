import express from "express";
import { createHandler } from "../utils/index.js";
import {
  getAll,
  create,
  updateClient,
  close,
  destroy,
  getByTableId,
} from "../handlers/consumptionHandler.js";

const router = express.Router();

router.get("/", createHandler(getAll));

router.get("/:id", createHandler(getByTableId));

router.post("/", createHandler(create));

router.put("/client/:id", createHandler(updateClient));

router.put("/close/:id", createHandler(close));

router.delete("/:id", createHandler(destroy));

export default router;
