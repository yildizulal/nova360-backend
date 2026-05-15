const Blog = require("../models/Blog");

const createSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
};

exports.createBlog = async (req, res) => {
    try {
        const { title } = req.body;

        const slug = createSlug(title.tr);

        const existingBlog = await Blog.findOne({ slug });

        if (existingBlog) {
            return res.status(400).json({
                success: false,
                message: "Bu blog zaten mevcut.",
            });
        }

        const blog = await Blog.create({
            ...req.body,
            slug,
        });

        res.status(201).json({
            success: true,
            message: "Blog başarıyla oluşturuldu.",
            blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Blog oluşturulurken hata oluştu.",
            error: error.message,
        });
    }
};

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({
            featured: -1,
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: blogs.length,
            blogs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Bloglar alınırken hata oluştu.",
            error: error.message,
        });
    }
};

exports.getSingleBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({
            slug: req.params.slug,
        });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog bulunamadı.",
            });
        }

        blog.views += 1;
        await blog.save();

        res.status(200).json({
            success: true,
            blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Blog alınırken hata oluştu.",
            error: error.message,
        });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog bulunamadı.",
            });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "Blog başarıyla güncellendi.",
            blog: updatedBlog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Blog güncellenirken hata oluştu.",
            error: error.message,
        });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog bulunamadı.",
            });
        }

        await blog.deleteOne();

        res.status(200).json({
            success: true,
            message: "Blog silindi.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Blog silinirken hata oluştu.",
            error: error.message,
        });
    }
};