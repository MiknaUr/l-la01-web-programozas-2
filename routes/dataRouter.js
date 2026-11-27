const router = require("express").Router();
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

module.exports = router;
