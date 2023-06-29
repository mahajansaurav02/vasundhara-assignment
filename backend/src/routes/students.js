const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

const authenticateTeacher = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'your-secret-key'); 

    const teacher = await Teacher.findOne({ _id: decoded._id, 'tokens.token': token });
    if (!teacher) {
      throw new Error();
    }

    req.token = token;
    req.teacher = teacher;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

router.post('/', authenticateTeacher, async (req, res) => {
  try {
    const { name, age } = req.body;

    const student = new Student({ teacherId: req.teacher._id, name, age });
    await student.save();

    res.status(201).json({ message: 'Student created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id', authenticateTeacher, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age } = req.body;

    const student = await Student.findOneAndUpdate(
      { _id: id, teacherId: req.teacher._id },
      { name, age },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', authenticateTeacher, async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findOneAndDelete({ _id: id, teacherId: req.teacher._id });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', authenticateTeacher, async (req, res) => {
  try {
    const students = await Student.find({ teacherId: req.teacher._id });

    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
