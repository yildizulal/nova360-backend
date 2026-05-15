const mongoose = require("mongoose");

const seoReportSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        month: {
            type: String,
            required: true,
        },

        score: {
            type: Number,
            default: 0,
        },

        organicTraffic: {
            type: Number,
            default: 0,
        },

        trafficChange: {
            type: Number,
            default: 0,
        },

        trafficBars: {
            type: [Number],
            default: [35, 48, 42, 62, 55, 78],
        },

        keywordTopThree: {
            type: Number,
            default: 0,
        },

        keywordTarget: {
            type: Number,
            default: 10,
        },

        backlinks: {
            type: Number,
            default: 0,
        },

        backlinkAuthority: {
            type: String,
            default: "",
        },

        topKeywords: [
            {
                keyword: String,
                position: String,
                change: String,
                volume: String,
                difficulty: String,
            },
        ],

        siteHealth: {
            crawlErrors: {
                type: Number,
                default: 0,
            },

            pageSpeed: {
                type: Number,
                default: 0,
            },

            brokenLinks: {
                type: Number,
                default: 0,
            },
        },

        improvements: {
            type: String,
            default: "",
        },

        recommendations: {
            type: String,
            default: "",
        },

        pdfUrl: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SeoReport", seoReportSchema);