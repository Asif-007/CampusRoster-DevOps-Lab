const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

let students = [
  {
    id: 1,
    name: "Aarav Mehta",
    rollNo: "CR101",
    course: "Computer Science"
  },
  {
    id: 2,
    name: "Diya Sharma",
    rollNo: "CR102",
    course: "Information Technology"
  }
];

// GET: Retrieve all students.
app.get("/students", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student records retrieved",
    data: students
  });
});

// GET: Retrieve one student by ID.
app.get("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((item) => item.id === id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student record not found"
    });
  }

  return res.status(200).json({
    success: true,
    data: student
  });
});

// POST: Create a student.
app.post("/students", (req, res) => {
  const { name, rollNo, course } = req.body;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof rollNo !== "string" || !rollNo.trim() ||
    typeof course !== "string" || !course.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid name, rollNo and course are required"
    });
  }

  const newStudent = {
    id: students.length
      ? Math.max(...students.map((item) => item.id)) + 1
      : 1,
    name: name.trim(),
    rollNo: rollNo.trim(),
    course: course.trim()
  };

  students.push(newStudent);

  return res.status(201).json({
    success: true,
    message: "Student record created",
    data: newStudent
  });
});

// PATCH: Update selected fields of a student.
app.patch("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((item) => item.id === id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student record not found"
    });
  }

  const allowedFields = ["name", "rollNo", "course"];
  const fields = Object.keys(req.body);

  if (
    fields.length === 0 ||
    fields.some((field) => !allowedFields.includes(field))
  ) {
    return res.status(400).json({
      success: false,
      message: "Provide valid student fields to update"
    });
  }

  for (const field of fields) {
    if (
      typeof req.body[field] !== "string" ||
      !req.body[field].trim()
    ) {
      return res.status(400).json({
        success: false,
        message: `Invalid value for ${field}`
      });
    }
  }

  for (const field of fields) {
    student[field] = req.body[field].trim();
  }

  return res.status(200).json({
    success: true,
    message: "Student record updated",
    data: student
  });
});

// DELETE: Remove a student by ID.
app.delete("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Student record not found"
    });
  }

  const deletedStudent = students.splice(index, 1)[0];

  return res.status(200).json({
    success: true,
    message: "Student record deleted",
    data: deletedStudent
  });
});

app.listen(PORT, () => {
  console.log(`CampusRoster API running at http://localhost:${PORT}`);
});
