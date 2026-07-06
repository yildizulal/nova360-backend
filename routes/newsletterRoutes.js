const express = require("express");

const {
    createNewsletter,
    getNewsletters,
    getSingleNewsletter,
    updateNewsletter,
    deleteNewsletter,
    markNewsletterAsReady,
} = require("../controllers/newsletterController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getNewsletters);
router.get("/:id", protect, getSingleNewsletter);
router.post("/", protect, createNewsletter);
router.put("/:id", protect, updateNewsletter);
router.delete("/:id", protect, deleteNewsletter);

router.patch("/:id/ready", protect, markNewsletterAsReady);

module.exports = router;