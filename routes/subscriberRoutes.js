const express = require("express");
const multer = require("multer");


const {
    createSubscriber,
    getSubscribers,
    updateSubscriber,
    deleteSubscriber,
    unsubscribeSubscriber,
    importSubscribers,
} = require("../controllers/subscriberController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", createSubscriber);
router.get("/", protect, getSubscribers);

router.post("/import", protect, upload.single("file"), importSubscribers);

router.put("/:id", protect, updateSubscriber);
router.delete("/:id", protect, deleteSubscriber);

router.get("/unsubscribe/:token", unsubscribeSubscriber);

module.exports = router;