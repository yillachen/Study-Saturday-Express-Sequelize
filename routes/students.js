const router = require('express').Router() // Express has a method called Router() that helps channel the different streams model instances are organized to eventually get pushed into the front end.
const Student = require('../db/models/student') // You're importing the Model you created from the database to give the Route a base on what they're supposed to expect

router.get('/', async (req, res, next) => { // to create a basic route, you use the router variable (created on line 1) and apply a CRUD request. This CRUD request takes a path and a function. The async function waits for a Promise of information to be fulfilled to send to your client.
  try { // the try/catch helps you handle "errors" that may occur when you're bridging the client to server to database.
    const students = await Student.findAll() // in this case, we want to get all the student instances in our Student table in the database, so we use a special Sequelize method called findAll.
    res.send(students) // It takes all that information and sends it back to the client.
  } catch (error) {
    next(error) // if there's an error, the next method tells it to move on to the rest of the codebase. Otherwise if we have just a return, the request goes nowhere and your client receives no info.
  }
})

router.get('/:id', async (req, res, next) => { // The :id is a "wildcard," which gives you access to the the PARAMeterS inside of the REQuest, thus req.params.id.
  try {
    let student = await Student.findByPk(req.params.id) // The path specifically asks for an ID. Example: if you type in "localhost:3000/1", Express is supposed to send back the student instance with the id (seen as id in Postico), or Primary Key, of 1.
    if (student) {
      res.send(student) // If there is a student with an id or PK of 1, then when you type in "localhost:3000/1" it should show you an object of that student's information.
    } else {
      res.status(404).send('Student not found') // If there's no student with an id of 1, then we send a message with an error status so you can debug
    }
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => { // We're using the CREATE method from the CRUD requests. This sends a new instance to your database.
  try {
    let student = await Student.create(req.body) // Here we're taking whatever information the client is giving us, validating all the fields are correct from your Models in db/models, and if it passes everything it gets sent to the database
    res.status(201).send(student)
  } catch (err) { // Otherwise, if the client's request has incorrect data (like a null firstName), then it sends the error.
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    let updatedStudentInfo = await Student.update(req.body, { // .update is a special Sequelize method that zeroes on on the instance and updates the information with the new information you're giving it.
      where: { id: req.params.id }, // We're specifying the request needs to provide an id (seen in the '/:id'), so we can go to that instance and edit that information only.
      returning: true,
      plain: true,
    })
    res.send(updatedStudentInfo[1])
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await Student.destroy({ where: { id: req.params.id } }) // Similar to update, this .destroy method is looking specifically for the ID provided in the Student table in your database to match and delete.
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

module.exports = router
