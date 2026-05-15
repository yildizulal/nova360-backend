const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        console.log("Gelen Authorization:", authHeader);

        let token;

        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.replace("Bearer", "").trim();
        }

        console.log("Ayrılan token:", token);
        console.log("Token parça sayısı:", token?.split(".").length);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Yetkisiz erişim. Token Bulunamadı",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Kullanıcı bulunamadı",
            });
        }
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Yetkisiz erişim.",
            error: error.message,
        })
    }
};