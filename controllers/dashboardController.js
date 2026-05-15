const Blog = require("../models/Blog");
const Bulletin = require("../models/Bulletin");
const SeoReport = require("../models/SeoReport");

exports.getDashboardStats = async (req, res) => {
    try {
        const totalBlogs = await Blog.countDocuments();

        const totalBulletins = await Bulletin.countDocuments();

        const totalSeoReports =
            await SeoReport.countDocuments();

        const latestBlogs = await Blog.find()
            .sort({ createdAt: -1 })
            .limit(5);

        const latestBulletins =
            await Bulletin.find()
                .sort({ createdAt: -1 })
                .limit(5);

        const latestSeoReports =
            await SeoReport.find()
                .sort({ createdAt: -1 })
                .limit(5);

        res.status(200).json({
            success: true,

            stats: {
                totalBlogs,
                totalBulletins,
                totalSeoReports,
            },

            latestBlogs,
            latestBulletins,
            latestSeoReports,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Dashboard verileri alınamadı.",
            error: error.message,
        });
    }
};