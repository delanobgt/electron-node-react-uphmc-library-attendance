const _ = require("lodash");
const db = require("../models");
const bcrypt = require("../modules/bcrypt");
const crypto = require("crypto");
const moment = require("moment");

exports.createAttendance = async (req, res) => {
  const { student_nim, time } = req.body;
  try {
    const student = await db.Student.findOne({
      where: { student_nim }
    });
    if (!student) {
      res.status(422).json({ msg: "Cannot find your NIM" });
    }
    const newAttendance = await db.Attendance.create({
      student_id: student.id,
      time: moment(time).toDate()
    });
    res.json({ ...student.dataValues, ...newAttendance.dataValues });
  } catch (err) {
    console.log(err);
    res.status(422).json({ msg: "Cannot log you in. Please try again." });
  }
};
