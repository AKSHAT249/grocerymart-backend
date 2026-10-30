import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./connection/db.js";  
import productsRoute from "./routes/productsRoute/index.js";
import categoryRoute from "./routes/categoryRoute/index.js";
import authRoute from "./routes/authRoute/index.js";

await pool.connect();

const app = express();


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/products", productsRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/auth", authRoute);





app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});