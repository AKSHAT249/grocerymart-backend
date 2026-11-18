import pool from "../../connection/db.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";



const fetchActiveCategories = async (req, res) => {
    try{
        const { rows } = await pool.query("SELECT * FROM categories WHERE is_active = true");
        return res.status(200).json({data: rows, message: "Categories fetched successfully"});
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

const fetchAllCategories = async (req, res) => {
    try{
        const { rows } = await pool.query("SELECT * FROM categories");
        return res.status(200).json({data: rows, message: "Categories fetched successfully"});
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}


const getCategoryById = async (req, res) => {
    try{
        const { id } = req.params;
        const { rows } = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);
        if(rows.length === 0){
            return res.status(404).json({message: "Category not found"});
        }
        return res.status(200).json({data: rows, message: "Category fetched successfully"});
    } catch (error) {
        console.error("Error fetching category:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}


const asBoolean = (value) => value === true || value === "true" || value === "1";

const createCategory = async (req, res) => {
    try{
        const { name, description, is_active } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "Category image is required" });
        }
        const uploaded = await uploadToCloudinary(req.file.buffer, "grocery/categories");
        const { rows } = await pool.query(
            "INSERT INTO categories (name, description, image_url, is_active) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, description, uploaded.url, asBoolean(is_active)]
        );
        return res.status(201).json({data: rows, message: "Category created successfully"});
    } catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

const updateCategory = async (req, res) => {
    try{
        const { id } = req.params;
        const { name, description, is_active } = req.body;
        const current = await pool.query("SELECT image_url FROM categories WHERE id = $1", [id]);
        if (current.rows.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        let imageUrl = current.rows[0].image_url;
        if (req.file) {
            const uploaded = await uploadToCloudinary(req.file.buffer, "grocery/categories");
            imageUrl = uploaded.url;
        }

        const { rows } = await pool.query(
            "UPDATE categories SET name = $1, description = $2, image_url = $3, is_active = $4 WHERE id = $5 RETURNING *",
            [name, description, imageUrl, asBoolean(is_active), id]
        );
        return res.status(200).json({data: rows, message: "Category updated successfully"});
    } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}


const deleteCategory = async (req, res) => {
    try{
        const { id } = req.params;
        const { rows } = await pool.query("DELETE FROM categories WHERE id = $1 RETURNING *", [id]);
        return res.status(200).json({data: rows, message: "Category deleted successfully"});
    } catch (error) {
        console.error("Error deleting category:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

export { fetchActiveCategories, fetchAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };