import ValidatorJs from "validatorjs";
import {
  Consumption,
  ConsumptionDetail,
  Product,
} from "../infrastructure/sequelize.js";
import ValidationError from "../errors/ValidationError.js";
import ApiError from "../errors/ApiError.js";

export const getAll = () => {
  return Consumption.findAll();
};

export const getByConsumptionId = (req) => {
  return Consumption.findOne({
    where: { consumptionId: req.params.id },
  });
};

export const create = async (req) => {
  const validator = new ValidatorJs(req.body, {
    productId: "required|integer",
    quantity: "required|integer",
  });
  if (validator.fails()) {
    throw new ValidationError(validator.errors.all());
  }

  const payload = req.body;
  const foundProduct = Product.findByPk(payload.productId);

  if (!foundProduct) {
    throw new ApiError("Product not found", 404);
  }

  if (payload.quantity <= 0) {
    throw new ApiError("Quantity must be greater than 0", 400);
  }

  const consumptionId = req.params.id;
  const foundConsumption = await Consumption.findByPk(consumptionId);

  foundConsumption.increment("total", {
    by: payload.quantity * foundProduct.price,
  });

  return ConsumptionDetail.create(payload);
};
