require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

const [username, password] = process.argv.slice(2);
if (!username || !password) {
    console.log("Használat: node createAdmin.js <felhasználónév> <jelszó>");
    process.exit(1);
}

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_PASSW);
        const hash = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
            { username: username },
            { username: username, password: hash, role: "admin" },
            { upsert: true }
        );
        console.log("Az admin felhasználó elkészült: " + username);
    } catch (err) {
        console.error("Hiba: " + err.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
})();
