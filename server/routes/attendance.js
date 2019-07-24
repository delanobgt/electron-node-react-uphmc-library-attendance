const router = require("express").Router();

const controller = require("../controllers/attendance");

router.post("/", controller.createAttendance);

module.exports = router;
