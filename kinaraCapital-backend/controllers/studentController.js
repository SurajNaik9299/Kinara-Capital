const asyncHandler = require("express-async-handler");
const Student = require("../models/Student");

const getAllStudents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0;

  //Default query limit(5) or set query limit
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search || "";
  let sort = req.query.sort || "name";

  req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

  let sortBy = {};
  if (sort[1]) {
    sortBy[sort[0]] = sort[1];
  } else {
    sortBy[sort[0]] = "asc";
  }

  const total = await Student.countDocuments({
    name: { $regex: search, $options: "i" },
  });

  const students = await Student.find({
    name: { $regex: search, $options: "i" },
  })
    .sort(sortBy)
    .skip(page * limit)
    .limit(limit);

  if (!students.length) {
    return res.status(400).json({ message: "Student data not found" });
  }

  const response = {
    error: false,
    total,
    page: page + 1,
    limit,
    students,
  };
  res.status(200).json(response);
});

const insertNewStudent = asyncHandler(async (req, res) => {
  const { name, totalMarks } = req.body;

  // Confirm incoming  Data
  if (!name || !totalMarks) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //Check for duplicates
  const duplicate = await Student.findOne({ name }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: `Duplicate Student ${name}` });
  }

  const studentObject = { name, totalMarks };

  //Create and store new student
  const student = await Student.create(studentObject);

  if (student) {
    res.status(201).json({ message: `New Student ${name} added.` });
  } else {
    res.status(400).json({ message: "Invalid Student data received." });
  }
});

module.exports = {
  getAllStudents,
  insertNewStudent,
};
