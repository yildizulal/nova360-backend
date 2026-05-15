const Bulletin = require("../models/Bulletin");

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

exports.createBulletin = async (req, res) => {
    try {
        const { title } = req.body;

        const slug = createSlug(title.tr);

        const existingBulletin = await Bulletin.findOne({ slug });

        if (existingBulletin) {
            return res.status(400).json({
                success: false,
                message: "Bu mali bülten zaten mevcut.",
            });
        }

        const bulletin = await Bulletin.create({
            ...req.body,
            slug,
        });

        res.status(201).json({
            success: true,
            message: "Mali bülten başarıyla oluşturuldu.",
            bulletin,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Mali bülten oluşturulurken hata oluştu.",
            error: error.message,
        });
    }
};

exports.getBulletins = async (req, res) => {
    try {
        const bulletins = await Bulletin.find().sort({
            featured: -1,
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: bulletins.length,
            bulletins,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Mali bültenler alınırken hata oluştu.",
            error: error.message,
        });
    }
};

exports.getSingleBulletin = async (req, res) => {
    try {
        const bulletin = await Bulletin.findOne({
            slug: req.params.slug,
        });

        if (!bulletin) {
            return res.status(404).json({
                success: false,
                message: "Mali bülten bulunamadı.",
            });
        }

        bulletin.views += 1;
        await bulletin.save();

        res.status(200).json({
            success: true,
            bulletin,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Mali bülten alınırken hata oluştu.",
            error: error.message,
        });
    }
};

exports.updateBulletin = async (req, res) => {
    try {
        const bulletin = await Bulletin.findById(req.params.id);

        if (!bulletin) {
            return res.status(404).json({
                success: false,
                message: "Mali bülten bulunamadı.",
            });
        }

        const updatedBulletin = await Bulletin.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "Mali bülten başarıyla güncellendi.",
            bulletin: updatedBulletin,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Mali bülten güncellenirken hata oluştu.",
            error: error.message,
        });
    }
};

exports.deleteBulletin = async (req, res) => {
    try {
        const bulletin = await Bulletin.findById(req.params.id);

        if (!bulletin) {
            return res.status(404).json({
                success: false,
                message: "Mali bülten bulunamadı.",
            });
        }

        await bulletin.deleteOne();

        res.status(200).json({
            success: true,
            message: "Mali bülten silindi.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Mali bülten silinirken hata oluştu.",
            error: error.message,
        });
    }
};