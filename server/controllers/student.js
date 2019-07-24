const _ = require("lodash");
const db = require("../models");
const moment = require("moment");

exports.getStudents = async (req, res) => {
  try {
    const students = await db.Student.findAll({
      include: [
        {
          model: db.StudyProgram,
          required: true
        }
      ]
    });
    res.json(students);
  } catch (err) {
    console.log(err);
    res.status(404).json({ msg: "Cannot get Students data" });
  }
};
