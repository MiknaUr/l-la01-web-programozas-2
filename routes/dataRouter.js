const router = require("express").Router();
const { isLoggedIn, isAdmin } = require("../middleware/auth");

module.exports = router;
