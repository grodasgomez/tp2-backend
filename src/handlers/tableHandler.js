import ValidatorJs from "validatorjs";
import { Table } from "../infrastructure/sequelize.js";
import ValidationError from "../errors/ValidationError.js";
import ApiError from "../errors/ApiError.js";
export const getAll = () => {
  return Table.findAll();
};

export const getByRestaurant = (req) => {
  return Table.findAll({ where: { restaurantId: req.params.id } });
};

export const create = (req) => {
  const validator = new ValidatorJs(req.body, {
    name: "required|string",
    restaurantId: "required|integer",
    positionX: "required|integer",
    positionY: "required|integer",
    floor: "required|integer",
    capacity: "required|integer",
  });
  if (validator.fails()) {
    throw new ValidationError(validator.errors.all());
  }
  const payload = req.body;
  return Table.create(payload);
};

export const update = async (req) => {
  const validator = new ValidatorJs(req.body, {
    name: "string",
    restaurantId: "integer",
    positionX: "integer",
    positionY: "integer",
    floor: "integer",
    capacity: "integer",
  });
  if (validator.fails()) {
    throw new ValidationError(validator.errors.all());
  }
  const payload = req.body;
  const tableId = req.params.id;
  const updated = await Table.update(payload, {
    where: { id: tableId },
  });

  if (!updated) {
    throw new ApiError("Table not found", 404);
  }
  return Table.findByPk(tableId);
};

export const destroy = async (req) => {
  const tableId = req.params.id;
  const table = await Table.findByPk(tableId);
  if (!table) throw new ApiError("Table not found", 404);

  await table.destroy({
    where: { id: table },
  });
  return table;
};
