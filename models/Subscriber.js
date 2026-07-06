const mongoose = require("mongoose");
const crypto = require("crypto");

const subscriberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: "",
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        company: {
            type: String,
            default: "",
            trim: true,
        },

        phone: {
            type: String,
            default: "",
            trim: true,
        },

        sector: {
            type: String,
            default: "",
            trim: true,
        },

        note: {
            type: String,
            default: "",
        },

        language: {
            type: String,
            enum: ["tr", "en"],
            default: "tr",
        },

        status: {
            type: String,
            enum: ["active", "passive", "unsubscribed"],
            default: "active",
        },

        source: {
            type: String,
            enum: ["website", "admin", "import"],
            default: "admin",
        },

        unsubscribeToken: {
            type: String,
            default: () => crypto.randomBytes(32).toString("hex"),
        },

        subscribedAt: {
            type: Date,
            default: Date.now,
        },

        lastMailAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Subscriber", subscriberSchema);