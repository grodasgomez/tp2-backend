import ValidatorJs from "validatorjs";
import {
  Consumption,
  ConsumptionDetail,
  Product,
} from "../infrastructure/sequelize.js";
import ValidationError from "../errors/ValidationError.js";
import ApiError from "../errors/ApiError.js";

export const getAll = () => {
  return ConsumptionDetail.findAll();
};

export const getByConsumptionId = (req) => {
  return ConsumptionDetail.findAll({
    where: { consumptionId: req.params.id },
  });
};

export const create = async (req) => {
  const validator = new ValidatorJs(req.body, {
    consumptionId: "required|integer",
    productId: "required|integer",
    quantity: "required|integer",
  });
  if (validator.fails()) {
    throw new ValidationError(validator.errors.all());
  }

  const payload = req.body;
  const foundProduct = await Product.findByPk(payload.productId);

  if (!foundProduct) {
    throw new ApiError("Product not found", 404);
  }

  if (payload.quantity <= 0) {
    throw new ApiError("Quantity must be greater than 0", 400);
  }

  const consumptionId = payload.consumptionId;
  const foundConsumption = await Consumption.findByPk(consumptionId);
  foundConsumption.increment("total", {
    by: payload.quantity * foundProduct.price,
  });

  return ConsumptionDetail.create(payload);
};
