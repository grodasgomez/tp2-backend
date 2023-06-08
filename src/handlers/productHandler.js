import ValidatorJs from "validatorjs";
import { Product, Category } from "../infrastructure/sequelize.js";
import ValidationError from "../errors/ValidationError.js";
import ApiError from "../errors/ApiError.js";

export const getAll = () => {
  return Product.findAll();
};

export const create = async (req) => {
  const validator = new ValidatorJs(req.body, {
    name: "required|string",
    categoryId: "required|integer",
    price: "required|integer",
  });

  if (validator.fails()) throw new ValidationError(validator.errors.all());

  const payload = req.body;

  const category = await Category.findByPk(payload.categoryId);

  if (!category) throw new ApiError("Category not found", 404);

  return Product.create(payload);
};

export const update = async (req) => {
  const validator = new ValidatorJs(req.body, {
    name: "string",
    categoryId: "integer",
    price: "integer",
  });
  if (validator.fails()) {
    throw new ValidationError(validator.errors.all());
  }
  const payload = req.body;

  if (payload.categoryId) {
    const category = await Category.findByPk(payload.categoryId);
    if (!category) throw new ApiError("Category not found", 404);
  }

  const productId = req.params.id;

  const updated = await Product.update(payload, {
    where: { id: productId },
  });

  if (!updated[0]) throw new ApiError("Product not found", 404);

  return Product.findByPk(productId);
};

export const destroy = async (req) => {
  const productId = req.params.id;
  const product = await Product.findByPk(productId);
  if (!product) throw new ApiError("Product not found", 404);

  await product.destroy({
    where: { id: product },
  });
  return product;
};
