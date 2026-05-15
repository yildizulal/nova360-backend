const SiteSettings = require("../models/SiteSettings");

exports.getSettings = async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();

        if (!settings) {
            settings = await SiteSettings.create({});
        }

        res.status(200).json({
            success: true,
            settings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ayarlar alınamadı.",
            error: error.message,
        });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();

        if (!settings) {
            settings = await SiteSettings.create(req.body);
        } else {
            settings = await SiteSettings.findByIdAndUpdate(
                settings._id,
                req.body,
                {
                    new: true,
                }
            );
        }

        res.status(200).json({
            success: true,
            settings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ayarlar güncellenemedi.",
            error: error.message,
        });
    }
};