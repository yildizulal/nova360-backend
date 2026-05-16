const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })
};

exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Bu e-posta zaten kayıtlı.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin",
        });

        res.status(201).json({
            success: true,
            message: "Admin kullanıcı oluşturuldu",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token: createToken(user._id),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Kayıt sırasında hata oluştu.",
            error: error.message,
        });
    }
};

exports.loginAdmin = async (req, res) => {
    try {
        console.log("Login isteği geldi", req.body);

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        console.log("Kullanıcı bulundu mu:", user ? "Evet" : "Hayır");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "E-posta veya şifre hatalı.",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log("Şifre doğru mu:", isPasswordCorrect);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "E-posta veya şifre hatalı.",
            });
        }

        const token = createToken(user._id);

        return res.status(200).json({
            success: true,
            message: "Giriş başarılı.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.log("Login hatası:", error);

        return res.status(500).json({
            success: false,
            message: "Giriş sırasında hata oluştu.",
            error: error.message,
        });
    }
};

exports.updateAdminPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email ve yeni şifre zorunludur.",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Admin şifresi güncellendi.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Şifre güncellenirken hata oluştu.",
            error: error.message,
        });
    }
};