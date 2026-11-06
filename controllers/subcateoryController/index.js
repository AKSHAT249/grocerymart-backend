

import pool from "../../connection/db.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";

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


const createSubcategory = async (req, res) => {
    const categoryId = req.params.categoryId;
    try{
        const { name } = req.body;
        const { file } = req;
        const { url, public_id } = await uploadToCloudinary(file.buffer, "subcategories");
        const { rows } = await pool.query("INSERT INTO subcategories (name, category_id, image_url, image_public_id) VALUES ($1, $2, $3, $4) RETURNING *", [name, categoryId, url, public_id]);
        return res.status(201).json({
            success: true,
            message: "Subcategory created successfully",
            data: rows[0]
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error in creating subcategory",
            error: error.message
        })
    }
}


// const updateSubcategory = async (req, res) => {
//     try{
//         const { subcategoryId } = req.params;
//         const { name } = req.body;
//         const { file } = req;
//         const { url, public_id } = await uploadToCloudinary(file.buffer, "subcategories");
//         const { rows } = await pool.query("UPDATE subcategories SET name = $1, image_url = $2, image_public_id = $3 WHERE id = $4 RETURNING *", [name, url, public_id, subcategoryId]);
//         return res.status(200).json({
//             success: true,
//             message: "Subcategory updated successfully",
//             data: rows[0]
//         });
//     }catch(error){
//         return res.status(500).json({
//             success: false,
//             message: "Error in updating subcategory",
//             error: error.message
//         })
//     }
// }


const updateSubcategory = async (req, res) => {
    try {
        const { subcategoryId } = req.params;
        const { name, is_active } = req.body;

        let image_url = null;
        let image_public_id = null;

        if (req.file) {
            const uploaded = await uploadToCloudinary(
                req.file.buffer,
                "subcategories"
            );

            image_url = uploaded.url;
            image_public_id = uploaded.public_id;
        }

        const result = await pool.query(
            `UPDATE subcategories
             SET
                name = COALESCE($1, name),
                is_active = COALESCE($2, is_active),
                image_url = COALESCE($3, image_url),
                image_public_id = COALESCE($4, image_public_id)
             WHERE id = $5
             RETURNING *`,
            [
                name || null,
                is_active !== undefined
                    ? is_active === "true" || is_active === true
                    : null,
                image_url,
                image_public_id,
                subcategoryId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Subcategory not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Subcategory updated successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Error updating subcategory"
        });
    }
};



const deleteSubcategory = async (req, res) => {
    try{
        const { subcategoryId } = req.params;
        const { rows } = await pool.query("DELETE FROM subcategories WHERE id = $1 RETURNING *", [subcategoryId]);
        return res.status(200).json({
            success: true,
            message: "Subcategory deleted successfully",
            data: rows[0]
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error in deleting subcategory",
            error: error.message
        })
    }
}



export { fetchSubcategories, createSubcategory, updateSubcategory, deleteSubcategory };