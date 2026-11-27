const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    nev: { type: String, required: true }
}, { collection: "oprendszer" });

module.exports = mongoose.model("Oprendszer", schema);
