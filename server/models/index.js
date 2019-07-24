let Sequelize = require("sequelize");

let sequelize = new Sequelize(null, null, null, {
  dialect: "sqlite",
  operatorsAliases: false,
  define: {
    timestamps: false
  },
  storage: "prod/db.sqlite3"
});

const Attendance = require("./attendance")(sequelize);
const Student = require("./student")(sequelize);
const StudyProgram = require("./study-program")(sequelize);

Student.belongsTo(StudyProgram, {
  foreignKey: "study_program_id",
  targetKey: "id"
});

Attendance.belongsTo(Student, {
  foreignKey: "student_id",
  targetKey: "id"
});

sequelize.sync({
  logging: console.log
});

module.exports = {
  Attendance,
  Student,
  StudyProgram
};
