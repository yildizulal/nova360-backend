const mongoose = require("mongoose");

const localizedString = {
    tr: {
        type: String,
        required: true,
        trim: true,
    },
    en: {
        type: String,
        default: "",
        trim: true,
    },
};

const localizedText = {
    tr: {
        type: String,
        required: true,
    },
    en: {
        type: String,
        default: "",
    },
};

const blogSchema = new mongoose.Schema(
    {
        title: localizedString,

        slug: {
            type: String,
            required: true,
            unique: true,
        },

        excerpt: localizedText,

        content: localizedText,

        image: {
            type: String,
            default: "",
        },

        category: {
            type: String,
            default: "Genel",
        },

        author: {
            type: String,
            default: "Nova360",
        },

        seoTitle: {
            tr: { type: String, default: "" },
            en: { type: String, default: "" },
        },

        seoDescription: {
            tr: { type: String, default: "" },
            en: { type: String, default: "" },
        },

        featured: {
            type: Boolean,
            default: false,
        },

        views: {
            type: Number,
            default: 0,
        },

        published: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);