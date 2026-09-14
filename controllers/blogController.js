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

const publicVisibilityQuery = () => ({
    published: true,
    $or: [
        { publishAt: null },
        { publishAt: { $exists: false } },
        { publishAt: { $lte: new Date() } },
    ],
});

const getEffectivePublishDate = (blog) => {
    return new Date(blog.publishAt || blog.createdAt).getTime();
};

const sortBlogs = (blogs) => {
    return blogs.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return getEffectivePublishDate(b) - getEffectivePublishDate(a);
    });
};

const normalizePublishSettings = (payload) => {
    const data = { ...payload };

    if (data.publishAt === "" || data.publishAt === undefined) {
        data.publishAt = null;
    }

    if (!data.published) {
        data.publishAt = null;
    }

    return data;
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

        const data = normalizePublishSettings(req.body);

        const blog = await Blog.create({
            ...data,
            slug,
        });

        res.status(201).json({
            success: true,
            message: blog.publishAt && new Date(blog.publishAt) > new Date()
                ? "Blog planlandı. Belirlenen tarih ve saatte otomatik yayınlanacak."
                : blog.published
                    ? "Blog başarıyla oluşturuldu ve yayınlandı."
                    : "Blog taslak olarak kaydedildi.",
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

// Public: yalnızca şu anda yayında olması gereken blogları döndürür.
exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find(publicVisibilityQuery());
        sortBlogs(blogs);

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

// Admin: taslak + planlı + yayındaki tüm bloglar.
exports.getAdminBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });

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

// Public detail: taslak veya zamanı gelmemiş planlı içerik dışarıdan açılamaz.
exports.getSingleBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({
            slug: req.params.slug,
            ...publicVisibilityQuery(),
        });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog bulunamadı veya henüz yayında değil.",
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

// Admin edit ekranı için; görüntülenme sayısını artırmaz.
exports.getAdminSingleBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog bulunamadı.",
            });
        }

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

        const data = normalizePublishSettings(req.body);

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            data,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: updatedBlog.publishAt && new Date(updatedBlog.publishAt) > new Date()
                ? "Blog güncellendi ve planlanan yayın tarihi kaydedildi."
                : updatedBlog.published
                    ? "Blog başarıyla güncellendi."
                    : "Blog taslak olarak güncellendi.",
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
