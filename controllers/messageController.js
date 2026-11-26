const Message = require("../models/Message");

exports.contactGet = (req, res) => { res.render("kapcsolat"); };
exports.contactPost = async (req, res) => {
    await Message.create({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        text: req.body.text
    });
    req.session.success = "Köszönjük, az üzenetét elküldtük!";
    res.redirect("/kapcsolat");
};
