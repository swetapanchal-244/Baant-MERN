const router = require("express").Router();
const a = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("admin"));

router.get("/overview", a.overview);
router.get("/users", a.listUsers);
router.patch("/ngos/:id/verify", a.setVerified);

module.exports = router;