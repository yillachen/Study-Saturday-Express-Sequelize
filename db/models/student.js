const Sequelize = require('sequelize');
const db = require('../db');

const Student = db.define('student', { // 1. Create a Student Model for your database, it takes two args: instance name and the attributes/fields you want to include for each instance. We're using "student" as the instance in this case.
  firstName: { // 2. The test specs require you have 3 attributes to pass: firstName, lastName and email
    type: Sequelize.STRING, // Every attribute/field has to have a TYPE, we're using STRING to indicate it can include letters, numbers and symbols.
    allowNull: false // Here we're saying it cannot be an empty/null field
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { // Here we create a special validation that makes sure the "email" field is an email (under the hood, Sequelize checks if it includes an @ symbol and a .com/.org/etc.)
      isEmail: true, // We keep "validate:" in an object, because we add more than one constraint, in this case, we're using only one constraint.
    },
  },
});

Student.beforeCreate((student) => { // Here we're introducing yet another validation checker that goes through your instance properties BEFORE you're allowed to add it into the database. In this lifecycle event/hook, you're making sure the firstName and lastName are entered with a capitalized first letter.
  const nameFirst = student.firstName;
  const nameLast = student.lastName;

  student.firstName = nameFirst[0].toUpperCase() + nameFirst.slice(1);
  student.lastName = nameLast[0].toUpperCase() + nameLast.slice(1);
});

module.exports = Student; // we export the model to be used in the rest of the repo
