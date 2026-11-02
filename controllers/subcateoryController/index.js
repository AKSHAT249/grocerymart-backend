

import pool from "../../connection/db.js";

const fetchSubcategories = async (req, res) => {
    try{
        const { categoryId } = req.params;
        const { rows } = await pool.query("SELECT * FROM subcategories WHERE category_id = $1", [categoryId]);
        return res.status(200).json(rows);

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error in fetching subcategories",
            error: error.message
        })
    }
}

export { fetchSubcategories };