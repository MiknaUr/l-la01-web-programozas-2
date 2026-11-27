const { isValidObjectId } = require("mongoose");
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

function megjelenitUrlap(res, opciok, adatok, gepId, hiba = "") {
    return res.status(hiba ? 422 : 200).render("notebook-urlap", {
        ...opciok, adatok, gepId, hiba
    });
}

router.param("gepId", (req, res, next, gepId) => {
    if (!isValidObjectId(gepId)) {
        return res.status(404).send("A notebook nem található.");
    }
    next();
});

router.get("/crud/uj", isAdmin, async (req, res) => {
    megjelenitUrlap(res, await betoltOpcioListak(), {}, null);
});

router.get("/crud/:gepId/szerkesztes", isAdmin, async (req, res) => {
    const gep = await Gep.findById(req.params.gepId).lean();
    if (!gep) {
        return res.status(404).send("A notebook nem található.");
    }
    megjelenitUrlap(res, await betoltOpcioListak(), gep, req.params.gepId);
});

async function mentNotebook(req, res) {
    const gepId = req.params.gepId ?? null;
    const adatok = notebookAdatok(req.body);
    const opciok = await betoltOpcioListak();
    const hiba = ellenorizNotebook(adatok, opciok);
    if (hiba) {
        return megjelenitUrlap(res, opciok, adatok, gepId, hiba);
    }

    for (const mezo of szamMezok) {
        adatok[mezo] = Number(adatok[mezo].replace(",", "."));
    }
    if (gepId) {
        const eredmeny = await Gep.updateOne({ _id: gepId }, adatok, { runValidators: true });
        if (!eredmeny.matchedCount) {
            return res.status(404).send("A notebook nem található.");
        }
    } else {
        await Gep.create(adatok);
    }
    res.redirect(303, "/crud");
}

router.post("/crud/uj", isAdmin, mentNotebook);
router.post("/crud/:gepId/szerkesztes", isAdmin, mentNotebook);

router.post("/crud/:gepId/torles", isAdmin, async (req, res) => {
    const eredmeny = await Gep.deleteOne({ _id: req.params.gepId });
    if (!eredmeny.deletedCount) {
        return res.status(404).send("A notebook nem található.");
    }
    res.redirect(303, "/crud");
});

module.exports = router;
