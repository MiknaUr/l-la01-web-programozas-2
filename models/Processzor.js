const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    gyarto: { type: String, required: true },
    tipus: { type: String, required: true }
}, { collection: "processzor" });

module.exports = mongoose.model("Processzor", schema);
