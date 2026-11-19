const router = require("express").Router();
const s = require("../controllers/statsController");
const { protect, authorize } = require("../middleware/auth");

router.get("/public", s.publicStats);
router.get("/donor", protect, authorize("donor"), s.donorStats);
router.get("/ngo", protect, authorize("ngo"), s.ngoStats);

module.exports = router;