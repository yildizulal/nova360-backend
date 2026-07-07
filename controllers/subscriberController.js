const Subscriber = require("../models/Subscriber");
const XLSX = require("xlsx");

const getValue = (row, keys) => {
    for (const key of keys) {
        if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
            return row[key];
        }
    }
    return "";
};

exports.createSubscriber = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "E-posta zorunludur.",
            });
        }

        const existingSubscriber = await Subscriber.findOne({ email });

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
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 15;
        const search = req.query.search || "";
        const status = req.query.status || "all";

        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } },
                { sector: { $regex: search, $options: "i" } },
            ];
        }

        if (status !== "all") {
            query.status = status;
        }

        const total = await Subscriber.countDocuments(query);

        const [totalAll, activeTotal, passiveTotal, unsubscribedTotal, subscribers] =
            await Promise.all([
                Subscriber.countDocuments(),
                Subscriber.countDocuments({ status: "active" }),
                Subscriber.countDocuments({ status: "passive" }),
                Subscriber.countDocuments({ status: "unsubscribed" }),
                Subscriber.find(query)
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit),
            ]);

        res.status(200).json({
            success: true,
            count: subscribers.length,
            total,
            totalAll,
            activeTotal,
            passiveTotal,
            unsubscribedTotal,
            page,
            totalPages: Math.ceil(total / limit) || 1,
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
        if (req.body.email) {
            req.body.email = req.body.email.trim().toLowerCase();
        }

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
            const email = getValue(row, [
                "E-posta",
                "Eposta",
                "Email",
                "email",
                "Mail",
                "mail",
                "E-mail",
                "E-Mail",
                "E-posta Adresi",
            ]);

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

            const language = getValue(row, ["Dil", "language", "Language"]) || "tr";
            const status = getValue(row, ["Durum", "status", "Status"]) || "active";

            await Subscriber.create({
                name: getValue(row, ["İsim", "Isim", "Ad Soyad", "Adı Soyadı", "name", "Name"]),
                email: cleanEmail,
                company: getValue(row, ["Firma", "Şirket", "company", "Company"]),
                phone: getValue(row, ["Telefon", "phone", "Phone"]),
                sector: getValue(row, ["Sektör", "Sektor", "sector", "Sector"]),
                language: String(language).toLowerCase() === "en" ? "en" : "tr",
                status: ["active", "passive", "unsubscribed"].includes(String(status).toLowerCase())
                    ? String(status).toLowerCase()
                    : "active",
                source: "import",
            });

            added++;
        }

        res.status(200).json({
            success: true,
            message: "İçe aktarma tamamlandı.",
            added,
            skipped,
            totalRows: rows.length,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "İçe aktarma sırasında hata oluştu.",
            error: error.message,
        });
    }
};