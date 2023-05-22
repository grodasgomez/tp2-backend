import ValidatorJs from "validatorjs";
import {
  Reservation,
  ReservationDetail,
  Table,
  Client,
  Restaurant,
} from "../infrastructure/sequelize.js";
import ValidationError from "../errors/ValidationError.js";
import { Op } from "sequelize";
import ApiError from "../errors/ApiError.js";
import { normalizeRangeTimes } from "../utils/index.js";

export const getAll = async (req) => {
  const validator = new ValidatorJs(req.query, {
    restaurant: "required|integer",
    date: "required|date",
    client: "integer",
  });

  if (validator.fails()) throw new ValidationError(validator.errors.all());

  const payload = req.query;
  const reservations = await Reservation.findAll({
    where: {
      date: payload.date,
      ...(payload.client && { clientId: payload.client }),
    },
    include: [
      {
        model: ReservationDetail,
      },
      {
        model: Table,
        include: {
          model: Restaurant,
          where: {
            id: payload.restaurant,
          },
        },
      },
      {
        model: Client,
      },
    ],
  });
  console.log(reservations);
  const data = reservations.map((reservation) => ({
    id: reservation.id,
    date: reservation.date,
    table: {
      id: reservation.Table.id,
      name: reservation.Table.name,
    },
    restaurant: {
      id: reservation.Table.Restaurant.id,
      name: reservation.Table.Restaurant.name,
      address: reservation.Table.Restaurant.address,
    },
    capacity: reservation.capacity,
    client: {
      id: reservation.Client.id,
      name: reservation.Client.name,
      lastName: reservation.Client.lastName,
      documentNumber: reservation.Client.documentNumber,
    },
    range_times: reservation.ReservationDetails.map((detail) => ({
      start: detail.startTime,
      end: detail.endTime,
    })),
  }));

  return data;
};

export const create = async (req) => {
  const validator = new ValidatorJs(req.body, {
    tableId: "required|integer",
    clientId: "required|integer",
    date: "required|date",
    capacity: "required|integer",
    range_times: "required",
    "range_times.*.start": "required|integer",
    "range_times.*.end": "required|integer",
  });
  if (validator.fails()) throw new ValidationError(validator.errors.all());

  const payload = req.body;

  const normalizedRangeTimes = normalizeRangeTimes(payload.range_times);

  const table = await Table.findByPk(payload.tableId);

  // Verificamos que la mesa exista y su capacidad sea mayor o igual a la capacidad solicitada
  if (!table) throw new ApiError("Table not found", 404);

  if (table.capacity < payload.capacity)
    throw new ApiError(
      `Table capacity (${table.capacity}) is less than the requested capacity (${payload.capacity})`,
      422
    );

  // Verificamos que la tabla este disponible para la fecha y rango de horas elegidas por el cliente
  const rangeTimeWhere = normalizedRangeTimes.map((rangeTime) => {
    return {
      startTime: {
        [Op.lt]: rangeTime.end,

      },
      endTime: {
        [Op.gt]: rangeTime.start,
      },
    };
  });
  const reservations = await Reservation.findAll({
    where: {
      tableId: payload.tableId,
      date: payload.date,
    },
    include: {
      model: ReservationDetail,
      where: {
        [Op.or]: rangeTimeWhere,
      },
    },
  });

  if (reservations.length > 0) {
    throw new ApiError(
      "Table not available for the date and range time selected",
      422
    );
  }
  const reservation = await Reservation.create(payload);

  const detailsPayload = normalizedRangeTimes.map((rangeTime) => ({
    reservationId: reservation.id,
    startTime: rangeTime.start,
    endTime: rangeTime.end,
  }));
  const reservationDetails = await ReservationDetail.bulkCreate(detailsPayload);

  const details = reservationDetails.map((reservationDetail) => ({
    start: reservationDetail.startTime,
    end: reservationDetail.endTime,
  }));

  const data = {
    ...reservation.toJSON(),
    rangeTimes: details,
  };
  return data;
};
