const router = require('express').Router()
const Test = require('../db/models/test') // We're doing something similar in this file as the routes/students.js HOWEVER we're working with associations now, since we created an association in the Test Model saying that only one test can belong to one student.
const Student = require('../db/models/student')

router.get('/', async (req, res, next) => {
  try {
    const tests = await Test.findAll()
    res.send(tests)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    let test = await Test.findByPk(req.params.id)
    if (test) {
      res.send(test)
    } else {
      res.status(404).send('Test not found')
    }
  } catch (err) {
    next(err)
  }
})

router.post('/student/:studentId', async (req, res, next) => { // Here we're using that association we created in the Test Model to dynamically assign a student instance with a test instance. In the req.params, we're given a "wildcard" studentId that refers to the FOREIGN KEY found in the Test table.
  try {
    let student = await Student.findByPk(req.params.studentId) // We're awaiting the id of the student this test is associated with
    let test = await Test.create(req.body) // We're awaiting to create a test instance to assign to the student instance
    let studentTest = await test.setStudent(student) // Here we're using a Sequelize MAGIC METHOD to dynamically assign that test to the student via a Foreign Key
    res.status(201).send(studentTest) // Once that test is assigned, we send back the object, which should show the Test instance with a nested object that contains the Student instance associated with it.
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await Test.destroy({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

module.exports = router
