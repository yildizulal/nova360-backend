const express = require("express");

const {
    registerAdmin,
    loginAdmin,
} = require("../controllers/authController");
const { updateAdminPassword } = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.put("/update-password", updateAdminPassword);

router.get("/me", protect, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    })
})

module.exports = router;

