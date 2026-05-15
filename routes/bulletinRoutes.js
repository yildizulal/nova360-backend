const express = require("express");

const {
    createBulletin,
    getBulletins,
    getSingleBulletin,
    updateBulletin,
    deleteBulletin,
} = require("../controllers/bulletinController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getBulletins);
router.get("/:slug", getSingleBulletin);
router.post("/", protect, createBulletin);
router.put("/:id", protect, updateBulletin);
router.delete("/:id", protect, deleteBulletin);

module.exports = router;