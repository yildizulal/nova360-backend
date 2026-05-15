const express = require("express");

const {
    createBlog,
    getBlogs,
    getSingleBlog,
    deleteBlog,
    updateBlog,
} = require("../controllers/blogController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getBlogs);

router.get("/:slug", getSingleBlog);

router.post("/", protect, createBlog);

router.put("/:id", protect, updateBlog);

router.delete("/:id", protect, deleteBlog);

module.exports = router;