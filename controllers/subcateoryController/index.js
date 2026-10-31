



const fetchSubcategories = async (req, res) => {
    try{
        const { categoryId } = req.params;
        const subcategories = await Subcategory.find({ category: categoryId });
        return res.status(200).json({
            success: true,
            message: "Subcategories fetched successfully",
            data: subcategories
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error in fetching subcategories",
            error: error.message
        })
    }
}