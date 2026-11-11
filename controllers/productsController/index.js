import pool from "../../connection/db.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";

function asNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
}

function asBoolean(value) {
    if (typeof value === "boolean") return value;
    return value !== "false" && value !== "0";
}



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
        const { name, description, category_id, subcategory_id, mrp_price, selling_price, is_available, unit, net_quantity } = req.body;
        const mrp = asNumber(mrp_price);
        const selling = asNumber(selling_price);
        const quantity = asNumber(net_quantity);

        if (!name || !description || !category_id || !subcategory_id || mrp == null || selling == null || !unit || quantity == null) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (!req.file) {
            return res.status(400).json({ error: "Product image is required" });
        }
        if (mrp < 0 || selling < 0 || quantity < 0) {
            return res.status(400).json({ error: "Price and quantity must be greater than 0" });
        }

        const { url } = await uploadToCloudinary(req.file.buffer, "products");
        const { rows } = await pool.query(
            "INSERT INTO products (name, description, category_id, subcategory_id, mrp_price, selling_price, product_image_url, is_available, unit, net_quantity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
            [name.trim(), description.trim(), category_id, subcategory_id, mrp, selling, url, asBoolean(is_available), unit.trim(), quantity]
        );
        return res.status(201).json({ data: rows[0], message: "Product created successfully" });
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ message: "Error in creating product", error: error.message });
    }
}


const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        const current = existing.rows[0];
        const { name, description, category_id, subcategory_id, mrp_price, selling_price, is_available, unit, net_quantity } = req.body;
        let imageUrl = current.product_image_url;

        if (req.file) {
            const uploaded = await uploadToCloudinary(req.file.buffer, "products");
            imageUrl = uploaded.url;
        }

        const { rows } = await pool.query(
            "UPDATE products SET name = $1, description = $2, category_id = $3, subcategory_id = $4, mrp_price = $5, selling_price = $6, product_image_url = $7, is_available = $8, unit = $9, net_quantity = $10 WHERE id = $11 RETURNING *",
            [
                (name ?? current.name).trim(),
                (description ?? current.description).trim(),
                category_id || current.category_id,
                subcategory_id || current.subcategory_id,
                asNumber(mrp_price) ?? current.mrp_price,
                asNumber(selling_price) ?? current.selling_price,
                imageUrl,
                is_available === undefined ? current.is_available : asBoolean(is_available),
                (unit ?? current.unit).trim(),
                asNumber(net_quantity) ?? current.net_quantity,
                id,
            ]
        );
        return res.status(200).json({ data: rows[0], message: "Product updated successfully" });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ message: "Error in updating product", error: error.message });
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