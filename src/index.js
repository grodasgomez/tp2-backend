import express from "express";
import restaurantRouter from "./routes/restaurantRouter.js";
import clientRouter from "./routes/clientRouter.js";
import tableRouter from "./routes/tableRouter.js";
import reservationRouter from "./routes/reservationRouter.js";
import ValidationError from "./errors/ValidationError.js";
import cors from "cors";

const app = express();

// Indicamos que vamos a recibir datos en formato JSON
app.use(cors());
app.use(express.json());

// Definimos las rutas de la API
app.use("/restaurants", restaurantRouter);
app.use("/clients", clientRouter);
app.use("/tables", tableRouter);
app.use("/reservations", reservationRouter);

// Middleware para manejar errores de forma centralizada
app.use((err, req, res, _next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({ errors: err.errors });
  }

  console.error(err);
  const status = err.statusCode ?? 500;
  const message = err.message ?? "Internal Server Error";
  return res.status(status).json({ error: message });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
