import Sequelize, { DataTypes } from "sequelize";
import {
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_SYNC_MODE,
} from "../env.js";

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
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
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

export const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoryId: {
    field: "category_id",
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: "id",
    },
  },
  price: {
    field: "price",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export const Consumption = sequelize.define("Consumption", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  tableId: {
    field: "table_id",
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Table,
      key: "id",
    },
  },
  isClosed: {
    field: "is_closed",
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  total: {
    field: "total",
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  createdAt: {
    field: "created_at",
    type: DataTypes.DATE,
    allowNull: false,
  },
  closedAt: {
    field: "closed_at",
    type: DataTypes.DATE,
    allowNull: true,
  },
});

export const ConsumptionDetail = sequelize.define("ConsumptionDetail", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  consumptionId: {
    field: "consumption_id",
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Consumption,
      key: "id",
    },
  },
  productId: {
    field: "product_id",
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: "id",
    },
  },
  quantity: {
    field: "quantity",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Reservation.hasMany(ReservationDetail, { foreignKey: "reservationId" });
Reservation.belongsTo(Table, { foreignKey: "tableId" });
Reservation.belongsTo(Client, { foreignKey: "clientId" });

Restaurant.hasMany(Table, { foreignKey: "restaurantId" });
Table.belongsTo(Restaurant, { foreignKey: "restaurantId" });

Consumption.hasMany(ConsumptionDetail, { foreignKey: "consumptionId", as: 'details' });

Product.belongsTo(Category, { foreignKey: "categoryId" });

Consumption.belongsTo(Table, { foreignKey: "tableId" });
Consumption.belongsTo(Client, { foreignKey: "clientId" });

ConsumptionDetail.belongsTo(Product, { foreignKey: "productId", as: 'product' });

// Si DB_SYNC es force, se borran las tablas y se crean de nuevo según los modelos
// Si DB_SYNC es alter, se modifican las tablas existentes según los modelos
if (DB_SYNC_MODE === "force" || DB_SYNC_MODE === "alter")
  await sequelize.sync({ [DB_SYNC_MODE]: true });
