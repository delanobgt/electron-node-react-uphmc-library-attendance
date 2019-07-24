const router = require("express").Router();

const controller = require("../controllers/student");

router.get("/", controller.getStudents);

module.exports = router;
