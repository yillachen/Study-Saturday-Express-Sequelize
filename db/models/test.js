const Sequelize = require('sequelize');
const db = require('../db');
const Student = require('./student');

const Test = db.define('test', { // Similar set up to the Student model
  subject: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  grade: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

Test.belongsTo(Student, { as: 'student' }); // So now that you have two models, what do you even do with the information?? Let's make them "talk" to each other. This association tells us that unique test can belong to only one student. The 'as' allows you to name that association field in your table whatever you want. When this populates in your database, you'll see "studentId" at the end of the Test table for each instance.

module.exports = Test;
