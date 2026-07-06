const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {
    createSubscriber,
    getSubscribers,
    updateSubscriber,
    deleteSubscriber,
    unsubscribeSubscriber,
    importSubscribers,
} = require("../controllers/subscriberController");

const { protect } = require("../middleware/authMiddleware");

router.post("/import", protect, upload.single("file"), importSubscribers);
const router = express.Router();

router.post("/", createSubscriber);
router.get("/", protect, getSubscribers);
router.put("/:id", protect, updateSubscriber);
router.delete("/:id", protect, deleteSubscriber);

router.get("/unsubscribe/:token", unsubscribeSubscriber);

module.exports = router;