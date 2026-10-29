import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./connection/db.js";  
import productsRoute from "./routes/productsRoute/index.js";

await pool.connect();

dotenv.config();

const app = express();


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/products", productsRoute);




app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});