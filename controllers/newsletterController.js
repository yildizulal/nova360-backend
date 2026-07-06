const Newsletter = require("../models/Newsletter");

exports.createNewsletter = async (req, res) => {
    try {
        const newsletter = await Newsletter.create({
            ...req.body,
            createdBy: req.user?._id || null,
        });

        res.status(201).json({
            success: true,
            message: "Newsletter taslağı oluşturuldu.",
            newsletter,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Newsletter oluşturulurken hata oluştu.",
            error: error.message,
        });
    }
};

exports.getNewsletters = async (req, res) => {
    try {
        const newsletters = await Newsletter.find()
            .populate("blogs", "title slug excerpt image category createdAt")
            .populate("bulletins", "title slug excerpt image category createdAt")
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: newsletters.length,
            newsletters,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Newsletter listesi alınırken hata oluştu.",
            error: error.message,
        });
    }
};

exports.getSingleNewsletter = async (req, res) => {
    try {
        const newsletter = await Newsletter.findById(req.params.id)
            .populate("blogs")
            .populate("bulletins")
            .populate("createdBy", "name email");

        if (!newsletter) {
            return res.status(404).json({
                success: false,
                message: "Newsletter bulunamadı.",
            });
        }

        res.status(200).json({
            success: true,
            newsletter,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Newsletter alınırken hata oluştu.",
            error: error.message,
        });
    }
};

exports.updateNewsletter = async (req, res) => {
    try {
        const newsletter = await Newsletter.findById(req.params.id);

        if (!newsletter) {
            return res.status(404).json({
                success: false,
                message: "Newsletter bulunamadı.",
            });
        }

        if (newsletter.status === "sent") {
            return res.status(400).json({
                success: false,
                message: "Gönderilmiş newsletter güncellenemez.",
            });
        }

        const updatedNewsletter = await Newsletter.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        )
            .populate("blogs")
            .populate("bulletins");

        res.status(200).json({
            success: true,
            message: "Newsletter güncellendi.",
            newsletter: updatedNewsletter,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Newsletter güncellenirken hata oluştu.",
            error: error.message,
        });
    }
};

exports.deleteNewsletter = async (req, res) => {
    try {
        const newsletter = await Newsletter.findById(req.params.id);

        if (!newsletter) {
            return res.status(404).json({
                success: false,
                message: "Newsletter bulunamadı.",
            });
        }

        if (newsletter.status === "sent") {
            return res.status(400).json({
                success: false,
                message: "Gönderilmiş newsletter silinemez.",
            });
        }

        await newsletter.deleteOne();

        res.status(200).json({
            success: true,
            message: "Newsletter silindi.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Newsletter silinirken hata oluştu.",
            error: error.message,
        });
    }
};

exports.markNewsletterAsReady = async (req, res) => {
    try {
        const newsletter = await Newsletter.findByIdAndUpdate(
            req.params.id,
            { status: "ready" },
            { new: true }
        );

        if (!newsletter) {
            return res.status(404).json({
                success: false,
                message: "Newsletter bulunamadı.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Newsletter gönderime hazır hale getirildi.",
            newsletter,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Newsletter durumu güncellenirken hata oluştu.",
            error: error.message,
        });
    }
};