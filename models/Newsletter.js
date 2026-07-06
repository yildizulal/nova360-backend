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

const newsletterSchema = new mongoose.Schema(
    {
        title: localizedString,

        subject: localizedString,

        summary: localizedText,

        type: {
            type: String,
            enum: ["blog", "bulletin", "mixed"],
            default: "mixed",
        },

        blogs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Blog",
            },
        ],

        bulletins: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Bulletin",
            },
        ],

        status: {
            type: String,
            enum: ["draft", "ready", "sent"],
            default: "draft",
        },

        recipientCount: {
            type: Number,
            default: 0,
        },

        brevoCampaignId: {
            type: String,
            default: "",
        },

        sentAt: {
            type: Date,
            default: null,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        scheduledAt: {
            type: Date,
            default: null,
        },

        sentBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Newsletter", newsletterSchema);