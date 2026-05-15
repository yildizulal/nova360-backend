const nodemailer = require("nodemailer");

exports.sendContactMail = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Lütfen tüm alanları doldurun.",
            });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        await transporter.sendMail({
            from: `"Nova360 İletişim Formu" <${process.env.SMTP_USER}>`,
            to: process.env.CONTACT_RECEIVER,
            replyTo: email,
            subject: `Yeni İletişim Formu: ${subject}`,
            html: `
        <h2>Yeni İletişim Formu Mesajı</h2>
        <p><strong>Ad Soyad:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Konu:</strong> ${subject}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message}</p>
      `,
        });

        res.status(200).json({
            success: true,
            message: "Mesaj başarıyla gönderildi.",
        });
    } catch (error) {
        console.log("Mail gönderme hatası:", error);

        res.status(500).json({
            success: false,
            message: "Mesaj gönderilirken hata oluştu.",
            error: error.message,
        });
    }
};