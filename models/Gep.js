const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    gyarto: { type: String, required: true },
    tipus: { type: String, required: true },
    kijelzo: { type: Number, required: true, min: 0 },
    memoria: { type: Number, required: true, min: 0 },
    merevlemez: { type: Number, required: true, min: 0 },
    videovezerlo: { type: String, default: "" },
    ar: { type: Number, required: true, min: 0 },
    processzorid: { type: Number, required: true, min: 0 },
    oprendszerid: { type: Number, required: true, min: 0 },
    db: { type: Number, required: true, min: 0 }
}, { collection: "gep" });

module.exports = mongoose.model("Gep", schema);
