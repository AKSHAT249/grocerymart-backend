import pool from "../../connection/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const createAdmin = async (req, res) => {
    try{
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const { rows } = await pool.query("INSERT INTO admins (name, email, password) VALUES ($1, $2, $3) RETURNING *", [name, email, hashedPassword]);
        return res.status(201).json({data: rows, message: "Admin created successfully"});
    } catch (error) {
        console.error("Error creating admin:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

const adminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const result = await pool.query(
        "SELECT * FROM admins WHERE email = $1",
        [email]
      );
  
      if (result.rows.length === 0) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }
  
      const admin = result.rows[0];
  
      const isMatch = await bcrypt.compare(
        password,
        admin.password
      );
  
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }
  
      const token = jwt.sign(
        {
          id: admin.id,
          role: "admin",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      res.json({
        message: "Login successful",
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        },
      });
  
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong", error: error.message
      });
    }
  };

export { createAdmin, adminLogin };