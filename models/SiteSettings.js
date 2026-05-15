const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
    {
        siteName: {
            type: String,
            default: "",
        },

        email: {
            type: String,
            default: "",
        },

        phone: {
            type: String,
            default: "",
        },

        whatsapp: {
            type: String,
            default: "",
        },

        address: {
            type: String,
            default: "",
        },

        mapEmbed: {
            type: String,
            default: "",
        },

        logo: {
            type: String,
            default: "",
        },

        favicon: {
            type: String,
            default: "",
        },

        instagram: {
            type: String,
            default: "",
        },

        linkedin: {
            type: String,
            default: "",
        },

        twitter: {
            type: String,
            default: "",
        },

        facebook: {
            type: String,
            default: "",
        },

        youtube: {
            type: String,
            default: "",
        },

        metaTitle: {
            type: String,
            default: "",
        },

        metaDescription: {
            type: String,
            default: "",
        },

        footerText: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);