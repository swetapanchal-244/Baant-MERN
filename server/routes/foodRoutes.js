const router = require("express").Router();
const f = require("../controllers/foodController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);

router.post("/", authorize("donor"), f.createFood);
router.get("/mine", authorize("donor"), f.myFood);

router.get("/nearby", authorize("ngo"), f.nearbyFood);
router.get("/pickups", authorize("ngo"), f.myPickups);
router.patch("/:id/accept", authorize("ngo"), f.acceptFood);
router.patch("/:id/status", authorize("ngo"), f.updateStatus);

module.exports = router;