const router = require("express").Router();
const { isLoggedIn, isAdmin } = require("../middleware/auth");
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

const szamMezok = ["kijelzo", "memoria", "merevlemez", "ar", "db", "processzorid", "oprendszerid"];

async function betoltOpcioListak() {
    const [processzorok, oprendszerek] = await Promise.all([
        Processzor.find().sort({ gyarto: 1, tipus: 1 }).lean(),
        Oprendszer.find().sort({ nev: 1 }).lean()
    ]);
    return { processzorok, oprendszerek };
}

function notebookAdatok(body) {
    const adatok = {};
    for (const mezo of ["gyarto", "tipus", "videovezerlo", ...szamMezok]) {
        adatok[mezo] = typeof body?.[mezo] === "string" ? body[mezo].trim() : "";
    }
    return adatok;
}

function ellenorizNotebook(adatok, { processzorok, oprendszerek }) {
    if (!adatok.gyarto || !adatok.tipus) {
        return "A gyártó és a típus megadása kötelező.";
    }
    const hibasSzam = szamMezok.some(mezo => {
        const formatum = mezo === "kijelzo" ? /^\d+(?:[.,]\d+)?$/ : /^\d+$/;
        const szam = Number(adatok[mezo].replace(",", "."));
        return !formatum.test(adatok[mezo]) || !Number.isFinite(szam) ||
            (mezo === "kijelzo" ? szam <= 0 : !Number.isSafeInteger(szam));
    });
    if (hibasSzam) {
        return "A kijelzőméret pozitív szám legyen, a többi számmező pedig nemnegatív egész szám.";
    }
    if (!processzorok.some(elem => elem.id === Number(adatok.processzorid)) ||
        !oprendszerek.some(elem => elem.id === Number(adatok.oprendszerid))) {
        return "Válassz érvényes processzort és operációs rendszert.";
    }
    return "";
}

router.get("/crud", isAdmin, async (req, res) => {
    const gepek = await Gep.find().sort({ gyarto: 1, tipus: 1 }).lean();
    res.render("crud", { gepek });
});

router.get("/crud/uj", isAdmin, async (req, res) => {
    res.render("notebook-urlap", {
        ...(await betoltOpcioListak()),
        adatok: {},
        hiba: ""
    });
});

router.post("/crud/uj", isAdmin, async (req, res) => {
    const adatok = notebookAdatok(req.body);
    const opciok = await betoltOpcioListak();
    const hiba = ellenorizNotebook(adatok, opciok);
    if (hiba) {
        return res.status(422).render("notebook-urlap", { ...opciok, adatok, hiba });
    }

    for (const mezo of szamMezok) {
        adatok[mezo] = Number(adatok[mezo].replace(",", "."));
    }
    await Gep.create(adatok);
    res.redirect(303, "/crud");
});

module.exports = router;
