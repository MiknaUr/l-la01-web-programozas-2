const Message = require("../models/Message");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (data) => {
    const errors = [];
    if (data.name.length < 2 || data.name.length > 50) {
        errors.push("A név 2 és 50 karakter között legyen!");
    }
    if (!emailPattern.test(data.email)) {
        errors.push("Adjon meg egy érvényes email címet!");
    }
    if (data.subject.length < 3 || data.subject.length > 100) {
        errors.push("A tárgy 3 és 100 karakter között legyen!");
    }
    if (data.text.length < 10 || data.text.length > 1000) {
        errors.push("Az üzenet 10 és 1000 karakter között legyen!");
    }
    return errors;
};

exports.contactGet = (req, res) => { res.render("kapcsolat", { errors: [], old: {} }); };
exports.contactPost = async (req, res) => {
    const data = {
        name: String(req.body.name || "").trim(),
        email: String(req.body.email || "").trim(),
        subject: String(req.body.subject || "").trim(),
        text: String(req.body.text || "").trim()
    };
    const errors = validate(data);
    if (errors.length > 0) {
        return res.status(400).render("kapcsolat", { errors: errors, old: data });
    }
    try {
        await Message.create(data);
    } catch (err) {
        return res.status(500).render("kapcsolat", { errors: ["Az üzenet mentése nem sikerült, próbálja újra később!"], old: data });
    }
    req.session.success = "Köszönjük, az üzenetét elküldtük!";
    res.redirect("/kapcsolat");
};
