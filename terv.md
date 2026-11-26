# Web programozás II beadandó terv

## Közös szabályok
- Repo: git@github.com:MiknaUr/l-la01-web-programozas-2.git (SSH)
- Mindenki saját, azonosítható git névvel és email címmel commitol, commit signing nem szükséges
- Személyenként legalább 5 commit, minden feladat külön
- A .env fájl és a temp mappa soha nem kerül fel (!)
- A node_modules mappa felkerül a GitHubra (tanári útmutató szerint)
- Dev1 a master branchen dolgozik, Dev2 saját branchen, ami a terv szerint lesz majd mergelve
- Közös fájlokat (app.js, header.ejs, footer.ejs, mainRouter.js) csak Dev1 módosít, a conflictok elkerülése érdekében

## Előkészítés (Dev1, master branch)
- Commit 1: .gitignore (.env, temp), a 07b Autentikáció megoldás bemásolása, package.json (express, mongoose, ejs, express-session, connect-mongo, bcrypt, dotenv), node_modules
- Commit 2: Atlas kapcsolat, a MONGO_URI kulcs helyett MONGODB_PASSW (Render útmutató szerint)
- Commit 3: isLoggedIn és isAdmin áthelyezése a mainRouter.js fájlból a middleware/auth.js fájlba, üres routes/dataRouter.js bekötése az app.js fájlba Dev2 számára
- Commit 4: Ingyenes reszponzív téma, közös layout, menü váz minden menüponttal és szerepkör szerinti láthatósággal, lábléc a készítők nevével és Neptun kódjával
- Dev2 felvétele közreműködőnek (Settings, Collaborators)
- Dev2 klónozza a repót és létrehozza a dev2 branchet a master branchből

## Dev1 fele (master branch)
- Commit 5: Bejelentkezés és regisztráció oldalak magyarítása és témához igazítása, admin felhasználó létrehozása
- Commit 6: Kapcsolat menü, űrlap és Message modell, mentés adatbázisba
- Commit 7: Szerver oldali validáció a kapcsolat űrlaphoz, hibaüzenetek visszaírása
- Commit 8: Üzenetek menü táblázattal, fordított időrend, küldési idő kiírása, isLoggedIn védelemmel

## Dev2 fele (dev2 branch)
- Minden útvonal a routes/dataRouter.js fájlba kerül, saját modellekkel és nézetekkel
- Commit 1: Adatbázis kiválasztása a megadott forrásokból, 3 tábla importálása az Atlas web2 adatbázisba
- Commit 2: Mongoose modellek a 3 táblához
- Commit 3: Főoldal látványos bemutató tartalommal, képek és szövegek az internetről
- Commit 4: Adatbázis menü, adatok megjelenítése mind a 3 táblából
- Commit 5: Diagram menü Chart.js használatával, adatok az adatbázisból
- Commit 6: CRUD menü egy táblához, listázás és létrehozás
- Commit 7: CRUD szerkesztés és törlés, isAdmin védelemmel a middleware/auth.js fájlból

## Pr
- Dev2 pull requestet nyit a dev2 branchből a masterbe
- Dev1 átnézi, feloldja az ütközéseket, majd mergeli
- A dev2 branch törölhető a merge után

## Utómunka
- Dev1: Render.com Web Service (New, Web Service, Public Git repository)
- Dev1: Language: Node, Start Command: node app.js, Free csomag
- Dev1: Environment Variables: MONGODB_PASSW, SESSION_MONGO_URI, SESSION_SECRET
- Dev1: Atlas IP Access List: 0.0.0.0/0
- Dev2: Tesztelés az onrender.com címen minden szerepkörrel
- Mindketten: Hibajavítások külön commitokban, utána Manual deploy

## Dokumentáció TODO
- Legalább 10 oldal képernyőképekkel
- Választott téma neve és forrása
- Minden pont megvalósításának leírása, ki melyik részt készítette
- Weboldal URL, GitHub URL
- Render.com, MongoDB Atlas és admin belépési adatok
- Fájlnév: Név-NeptunKód.pdf, mindkét fejlesztő külön beadja Teamsen
