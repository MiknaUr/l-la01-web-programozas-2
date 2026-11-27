const router = require("express").Router();
const { isLoggedIn } = require("../middleware/auth");
const Gep = require("../models/Gep");
const Processzor = require("../models/Processzor");
const Oprendszer = require("../models/Oprendszer");

router.get("/adatbazis", async (req, res, next) => {
    try {
        const [gepek, processzorok, oprendszerek] = await Promise.all([
            Gep.find().sort({ gyarto: 1, tipus: 1 }).lean(),
            Processzor.find().lean(),
            Oprendszer.find().lean()
        ]);

        const processzorNevek = new Map(processzorok.map(({ id, gyarto, tipus }) => [id, gyarto + " " + tipus]));
        const oprendszerNevek = new Map(oprendszerek.map(({ id, nev }) => [id, nev]));

        res.render("adatbazis", { gepek, processzorNevek, oprendszerNevek });
    } catch (error) {
        next(error);
    }
});

router.get("/diagram", isLoggedIn, async (req, res, next) => {
    try {
        const gyartok = await Gep.aggregate([
            { $group: { _id: "$gyarto", darab: { $sum: 1 } } },
            { $sort: { darab: -1, _id: 1 } }
        ]);

        res.render("diagram", { gyartok });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
