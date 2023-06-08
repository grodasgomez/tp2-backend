import express from "express";
import { createHandler } from "../utils/index.js";
import {
  getAll,
  create,
  getByConsumptionId,
} from "../handlers/consumptionDetailHandler.js";

const router = express.Router();

router.get("/", createHandler(getAll));

router.get("/:id", createHandler(getByConsumptionId));

router.post("/", createHandler(create));

export default router;
