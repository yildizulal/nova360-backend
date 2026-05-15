const express = require("express");

const {
    createSeoReport,
    getSeoReports,
    getSingleSeoReport,
    updateSeoReport,
    deleteSeoReport,
} = require("../controllers/seoReportController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getSeoReports);

router.get("/:id", getSingleSeoReport);

router.post("/", protect, createSeoReport);

router.put("/:id", protect, updateSeoReport);

router.delete("/:id", protect, deleteSeoReport);

module.exports = router;