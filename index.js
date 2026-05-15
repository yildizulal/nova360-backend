const newsRoutes = require("./routes/newsRoutes");
const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const bulletinRoutes = require("./routes/bulletinRoutes");
const seoReportRoutes = require("./routes/seoReportRoutes");
const siteSettingsRoutes = require("./routes/siteSettingsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const contactRoutes = require("./routes/contactRoutes");

const envPath = path.resolve(__dirname, ".env");
console.log("ENV PATH:", envPath);

const result = dotenv.config({ path: envPath });
console.log("DOTENV RESULT:", result.error || "OK");
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);

// geçici
console.log("ENV KEYS:", Object.keys(process.env).filter((key) =>
    key.includes("CLOUDINARY")
));

connectDB();

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://nova360.org.tr",
            "https://www.nova360.org.tr",
        ],
        credentials: true,
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Nova API çalışıyor");
});

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/bulletins", bulletinRoutes);
app.use("/api/seo-reports", seoReportRoutes);
app.use("/api/settings", siteSettingsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/news", newsRoutes);

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend bağlantısı başarılı",
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);

})