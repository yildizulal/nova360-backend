const SeoReport = require("../models/SeoReport");

exports.createSeoReport = async (req, res) => {
    try {
        const report = await SeoReport.create(req.body);

        res.status(201).json({
            success: true,
            report,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "SEO raporu oluşturulamadı.",
            error: error.message,
        });
    }
};

exports.getSeoReports = async (req, res) => {
    try {
        const reports = await SeoReport.find().sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            reports,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "SEO raporları alınamadı.",
            error: error.message,
        });
    }
};

exports.getSingleSeoReport = async (req, res) => {
    try {
        const report = await SeoReport.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "SEO raporu bulunamadı.",
            });
        }

        res.status(200).json({
            success: true,
            report,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "SEO raporu alınamadı.",
            error: error.message,
        });
    }
};

exports.updateSeoReport = async (req, res) => {
    try {
        const report = await SeoReport.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        res.status(200).json({
            success: true,
            report,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "SEO raporu güncellenemedi.",
            error: error.message,
        });
    }
};

exports.deleteSeoReport = async (req, res) => {
    try {
        await SeoReport.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "SEO raporu silindi.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "SEO raporu silinemedi.",
            error: error.message,
        });
    }
};