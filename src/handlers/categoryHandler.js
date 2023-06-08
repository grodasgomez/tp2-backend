import ValidatorJs from "validatorjs";
import { Category } from "../infrastructure/sequelize.js";
import ValidationError from "../errors/ValidationError.js";
import ApiError from "../errors/ApiError.js";

export const getAll = () => {
  return Category.findAll();
};


export const create = (req) => {
  const validator = new ValidatorJs(req.body, {
    name: "required|string",
  });
  if (validator.fails()) {
    throw new ValidationError(validator.errors.all());
  }
  const payload = req.body;
  return Category.create(payload);
};

export const update = async (req) => {
  const validator = new ValidatorJs(req.body, {
    name: "string",
  });
  if (validator.fails()) {
    throw new ValidationError(validator.errors.all());
  }
  const payload = req.body;
  const categoryId = req.params.id;
  const updated = await Category.update(payload, {
    where: { id: categoryId },
  });

  if (!updated[0]) {
    throw new ApiError("Category not found", 404);
  }
  return Category.findByPk(categoryId);
};

export const destroy = async (req) => {
  const categoryId = req.params.id;
  const category = await Category.findByPk(categoryId);
  if (!category) throw new ApiError("Category not found", 404);

  await category.destroy({
    where: { id: category },
  });
  return category;
};
