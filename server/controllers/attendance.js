const _ = require("lodash");
const db = require("../models");
const moment = require("moment");
const Op = require("sequelize").Op;

exports.getAttendances = async (req, res) => {
  const { startDate, endDate } = req.query;
  console.log({ startDate, endDate });
  try {
    const attendances = await db.Attendance.findAll({
      where: {
        time: { [Op.gte]: moment(startDate).toDate() },
        time: {
          [Op.lt]: moment(endDate, "YYYY-MM-DD")
            .add(1, "days")
            .toDate()
        }
      },
      include: [
        {
          model: db.Student,
          required: true,
          include: [{ model: db.StudyProgram, required: true }]
        }
      ]
    });
    res.json(attendances);
  } catch (err) {
    console.log(err);
    res.status(404).json({ msg: "Cannot get Attendances data" });
  }
};

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
