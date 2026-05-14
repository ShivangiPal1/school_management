import express from "express";
import dotenv from "dotenv";
import schoolRoutes from "./routes/schoolRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { testDatabaseConnection } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "School Management API is running"
  });
});

app.use("/", schoolRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await testDatabaseConnection();

    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;