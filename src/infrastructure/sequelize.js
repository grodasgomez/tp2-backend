import Sequelize, { DataTypes } from "sequelize";
import { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_SYNC_MODE } from "../env.js";


const sequelize = new Sequelize({
  host: DB_HOST,
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  dialect: "postgres",
  logging: true,
});

export const Restaurant = sequelize.define("Restaurant", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export const Client = sequelize.define("Client", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  documentNumber: {
    field: "document_number",
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    field: "last_name",
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export const Table = sequelize.define("Table", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  restaurantId: {
    field: "restaurant_id",
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Restaurant,
      key: "id",
    },
  },
  positionX: {
    field: "position_x",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  positionY: {
    field: "position_y",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export const Reservation = sequelize.define("Reservation", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tableId: {
    field: "table_id",
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Table,
      key: "id",
    },
  },
  clientId: {
    field: "client_id",
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Client,
      key: "id",
    },
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  }
});

export const ReservationDetail = sequelize.define("ReservationDetail", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  reservationId: {
    field: "reservation_id",
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Reservation,
      key: "id",
    },
  },
  startTime: {
    field: "start_time",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  endTime: {
    field: "end_time",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Reservation.hasMany(ReservationDetail, { foreignKey: "reservationId" });
Reservation.belongsTo(Table, { foreignKey: "tableId" });
Reservation.belongsTo(Client, { foreignKey: "clientId" });

Restaurant.hasMany(Table, { foreignKey: "restaurantId" });
Table.belongsTo(Restaurant, { foreignKey: "restaurantId" });

// Si DB_SYNC es force, se borran las tablas y se crean de nuevo según los modelos
// Si DB_SYNC es alter, se modifican las tablas existentes según los modelos
if (DB_SYNC_MODE === "force" || DB_SYNC_MODE === "alter")
  await sequelize.sync({ [DB_SYNC_MODE]: true });
