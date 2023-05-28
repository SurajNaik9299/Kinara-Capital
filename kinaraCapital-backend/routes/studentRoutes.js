const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

router
  .route("/")
  .get(studentController.getAllStudents)
  .post(studentController.insertNewStudent);

module.exports = router;
