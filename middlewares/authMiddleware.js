import jwt from "jsonwebtoken";



const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check whether token exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Token is required."
            });
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Attach user details to request
        req.user = decoded;

        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Session expired. Please login again."
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid authentication token."
        });
    }

}

export default verifyToken;