const express = require("express");

const {
    createBlog,
    getBlogs,
    getAdminBlogs,
    getSingleBlog,
    getAdminSingleBlog,
    deleteBlog,
    updateBlog,
} = require("../controllers/blogController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin route'ları dinamik /:slug route'undan önce olmalı.
router.get("/admin/all", protect, getAdminBlogs);
router.get("/admin/:slug", protect, getAdminSingleBlog);

// Public route'lar yalnızca yayında olan içerikleri döndürür.
router.get("/", getBlogs);
router.get("/:slug", getSingleBlog);

router.post("/", protect, createBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

module.exports = router;
