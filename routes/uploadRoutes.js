const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

router.post(
    "/",
    protect,
    upload.single("file"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Dosya bulunamadı.",
                });
            }

            const isPdf =
                req.file.mimetype ===
                "application/pdf";

            const base64File = `data:${req.file.mimetype
                };base64,${req.file.buffer.toString(
                    "base64"
                )}`;

            const result =
                await cloudinary.uploader.upload(
                    base64File,
                    {
                        folder: "nova360",
                        resource_type: isPdf
                            ? "raw"
                            : "image",
                    }
                );

            res.status(200).json({
                success: true,
                fileUrl: result.secure_url,
            });
        } catch (error) {
            console.log(
                "Cloudinary upload hatası:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Dosya yüklenirken hata oluştu.",
                error: error.message,
            });
        }
    }
);

module.exports = router;