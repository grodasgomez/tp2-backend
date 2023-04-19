import ValidatorJs from 'validatorjs';
import {Client} from '../infrastructure/sequelize.js';
import ValidationError from '../errors/ValidationError.js';
import ApiError from '../errors/ApiError.js';

export const getAll = () => {
  return Client.findAll();
};

export const create = async (req) => {
  const validator = new ValidatorJs(req.body, {
    documentNumber: "required|string",
    name: "required|string",
    lastName: "required|string",
  });
  if (validator.fails()) {
    throw new ValidationError(validator.errors.all());
  }
  const payload = req.body;

  const client = await Client.findOne({
    where: { documentNumber: payload.documentNumber },
  });
  if (client) {
    throw new ApiError(
      `Already exists client with the document number ${payload.documentNumber}`,
      422
    );
  }
  const data = await Client.create(payload);
  return data;
};