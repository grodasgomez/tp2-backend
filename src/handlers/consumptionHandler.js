import ValidatorJs from "validatorjs";
import { Consumption } from "../infrastructure/sequelize.js";
import ValidationError from "../errors/ValidationError.js";
import ApiError from "../errors/ApiError.js";

export const getAll = () => {
  return Consumption.findAll();
};

export const getByTableId = (req) => {
  return Consumption.findOne({
    where: { tableId: req.params.id, isClosed: false },
  });
};

export const create = (req) => {
  const validator = new ValidatorJs(req.body, {
    clientId: "required|integer",
    tableId: "required|integer",
  });
  if (validator.fails()) {
    throw new ValidationError(validator.errors.all());
  }
  const payload = req.body;
  payload["createdAt"] = new Date();
  return Consumption.create(payload);
};

export const updateClient = async (req) => {
  const validator = new ValidatorJs(req.body, {
    clientId: "required|integer",
  });
  if (validator.fails()) {
    throw new ValidationError(validator.errors.all());
  }
  const payload = req.body;
  const consumptionId = req.params.id;
  const updated = await Consumption.update(payload, {
    where: { id: consumptionId },
  });

  if (!updated[0]) {
    throw new ApiError("Consumption not found", 404);
  }
  return Consumption.findByPk(consumptionId);
};

export const close = async (req) => {
  const payload = { isClosed: true, closedAt: new Date() };
  const consumptionId = req.params.id;

  const updated = await Consumption.update(payload, {
    where: { id: consumptionId },
  });

  if (!updated[0]) {
    throw new ApiError("Consumption not found", 404);
  }
  return Consumption.findByPk(consumptionId);
};

export const destroy = async (req) => {
  const consumptionId = req.params.id;
  const consumption = await Consumption.findByPk(consumptionId);
  if (!consumption) throw new ApiError("Consumption not found", 404);

  await consumption.destroy({
    where: { id: consumption },
  });
  return consumption;
};