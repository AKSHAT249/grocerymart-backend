import pool from "../../connection/db.js";



const fetchProducts = async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM products");
        return res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

const getProductById = async ( req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        return res.status(200).json({ rows, message: "Product fetched successfully" });
    } catch (error) {
        console.error("Error fetching product by id:", error);
        throw error;
    }
};


const createProduct = async (req, res) => {
    try {
        const { name, description, category, price, image_url, stock_quantity, is_available } = req.body;

        if (!name || !description || !category || !price || !image_url || !stock_quantity || !is_available) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (typeof name !== "string" || typeof description !== "string" || typeof category !== "string" || typeof price !== "number" || typeof image_url !== "string" || typeof stock_quantity !== "number" || typeof is_available !== "boolean") {
            return res.status(400).json({ error: "Invalid fields", message: error.message });
        }
        if (price < 0) {
            return res.status(400).json({ error: "Price must be greater than 0", message: error.message });
        }
        if (stock_quantity < 0) {
            return res.status(400).json({ error: "Stock quantity must be greater than 0" });
        }
        if (is_available === undefined) {
            is_available = true;
        }
        if (name.length > 150) {
            return res.status(400).json({ error: "Name must be less than 150 characters" });
        }
        if (description.length > 1000) {
            return res.status(400).json({ error: "Description must be less than 1000 characters" });
        }
        if (category.length > 100) {
            return res.status(400).json({ error: "Category must be less than 100 characters" });
        }

        const { rows } = await pool.query("INSERT INTO products (name, description, category, price, image_url, stock_quantity, is_available) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [name, description, category, price, image_url, stock_quantity, is_available]);
        return res.status(201).json({ rows, message: "Product created successfully" });
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
}


const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, price, image_url, stock_quantity, is_available } = req.body;
        const { rows } = await pool.query("UPDATE products SET name = $1, description = $2, category = $3, price = $4, image_url = $5, stock_quantity = $6, is_available = $7 WHERE id = $8 RETURNING *", [name, description, category, price, image_url, stock_quantity, is_available, id]);
        return res.status(200).json({ rows, message: "Product updated successfully" });
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
        return res.status(200).json({ rows, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
};

export { fetchProducts, getProductById, createProduct, updateProduct, deleteProduct };