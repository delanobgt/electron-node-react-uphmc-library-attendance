let Sequelize = require("sequelize");

let model = function(sequelize) {
  return sequelize.define("attendance", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true
    },
    student_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    time: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });
};

module.exports = model;
