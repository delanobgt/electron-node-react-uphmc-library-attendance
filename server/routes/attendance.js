const router = require("express").Router();

const controller = require("../controllers/attendance");

router.get("/", controller.getAttendances);
router.post("/", controller.createAttendance);

module.exports = router;
