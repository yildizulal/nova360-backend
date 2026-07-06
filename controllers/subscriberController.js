const Subscriber = require("../models/Subscriber");
const XLSX = require("xlsx");

exports.createSubscriber = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();

        const existingSubscriber = await Subscriber.findOne({
            email,
        });

        if (existingSubscriber) {
            return res.status(400).json({
                success: false,
                message: "Bu e-posta zaten abone listesinde mevcut.",
            });
        }

        const subscriber = await Subscriber.create({
            ...req.body,
            email,
        });

        res.status(201).json({
            success: true,
            message: "Abone başarıyla eklendi.",
            subscriber,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Abone eklenirken hata oluştu.",
            error: error.message,
        });
    }
};

exports.getSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: subscribers.length,
            subscribers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Aboneler alınırken hata oluştu.",
            error: error.message,
        });
    }
};

exports.updateSubscriber = async (req, res) => {
    try {
        const subscriber = await Subscriber.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: "Abone bulunamadı.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Abone güncellendi.",
            subscriber,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Abone güncellenirken hata oluştu.",
            error: error.message,
        });
    }
};

exports.deleteSubscriber = async (req, res) => {
    try {
        const subscriber = await Subscriber.findById(req.params.id);

        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: "Abone bulunamadı.",
            });
        }

        await subscriber.deleteOne();

        res.status(200).json({
            success: true,
            message: "Abone silindi.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Abone silinirken hata oluştu.",
            error: error.message,
        });
    }
};

exports.unsubscribeSubscriber = async (req, res) => {
    try {
        const subscriber = await Subscriber.findOneAndUpdate(
            { unsubscribeToken: req.params.token },
            { status: "unsubscribed" },
            { new: true }
        );

        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: "Abone bulunamadı.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Abonelikten çıkış yapıldı.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Abonelikten çıkış sırasında hata oluştu.",
            error: error.message,
        });
    }
};

exports.importSubscribers = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Lütfen Excel veya CSV dosyası yükleyin.",
            });
        }

        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        let added = 0;
        let skipped = 0;

        for (const row of rows) {
            const email =
                row.email ||
                row.Email ||
                row["E-posta"] ||
                row["Eposta"] ||
                row["Mail"] ||
                row["mail"];

            if (!email) {
                skipped++;
                continue;
            }

            const cleanEmail = String(email).trim().toLowerCase();

            const existing = await Subscriber.findOne({ email: cleanEmail });

            if (existing) {
                skipped++;
                continue;
            }

            await Subscriber.create({
                name: row.name || row.Name || row["Ad Soyad"] || row["İsim"] || "",
                email: cleanEmail,
                company: row.company || row.Company || row["Firma"] || "",
                phone: row.phone || row.Phone || row["Telefon"] || "",
                sector: row.sector || row.Sector || row["Sektör"] || "",
                language: "tr",
                source: "import",
                status: "active",
            });

            added++;
        }

        res.status(200).json({
            success: true,
            message: "İçe aktarma tamamlandı.",
            added,
            skipped,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "İçe aktarma sırasında hata oluştu.",
            error: error.message,
        });
    }
};