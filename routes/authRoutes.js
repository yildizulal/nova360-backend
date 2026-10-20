const express = require("express");

const {
    loginAdmin,
    updateAdminPassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Yeni admin oluşturma endpoint'i kapalı
// router.post("/register", registerAdmin);

// Admin girişi
router.post("/login", loginAdmin);

// Giriş yapan kullanıcının bilgileri
router.get("/me", protect, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
});

// Şifre değiştirme
router.put("/change-password", protect, updateAdminPassword);

module.exports = router;