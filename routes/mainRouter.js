const router = require("express").Router();
const controller = require("../controllers/mainController");
const messageController = require("../controllers/messageController");
const { isLoggedIn, isAdmin } = require("../middleware/auth");

router.get("/", controller.homeIndex);
router.get("/register", controller.registerGet);
router.post("/register", controller.registerPost);
router.get("/login", controller.loginGet);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);
router.get("/user", isLoggedIn, controller.userIndex);
router.get("/admin", isAdmin, controller.adminIndex);
router.get("/kapcsolat", messageController.contactGet);
router.post("/kapcsolat", messageController.contactPost);
router.get("/uzenetek", isLoggedIn, messageController.messagesIndex);
module.exports = router;
