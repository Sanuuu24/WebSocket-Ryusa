
const { student, major } = require('../models');

const getAllStudents = async (req, res) => {
  try {
    const students = await student.findAll({
      include: [{
        model: major,
        attributes: ['name', 'alias']
      }]
    });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getStudentById = async (req, res) => {
  try {
    const id = req.params.id;
    const foundStudent = await student.findByPk(id, {
      include: [{
        model: major,
        attributes: ['name', 'alias']
      }]
    });
    
    if (!foundStudent) {
      return res.status(404).json({ message: 'Student tidak ditemukan' });
    }
    
    res.status(200).json(foundStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createStudent = async (req, res) => {
  try {
    const { firstName, lastName, classes, gender, major_id } = req.body;
    
    if (!firstName || !lastName || !classes || !gender || !major_id) {
      return res.status(400).json({ message: 'Semua field diperlukan' });
    }
    

    const newStudent = await student.create({
      firstName,
      lastName,
      classes,
      gender,
      major_id
    });
    
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, classes, gender, major_id } = req.body;
    
    const foundStudent = await student.findByPk(id);
    
    if (!foundStudent) {
      return res.status(404).json({ message: 'Student tidak ditemukan' });
    }
    
    await foundStudent.update({
      firstName: firstName || foundStudent.firstName,
      lastName: lastName || foundStudent.lastName,
      classes: classes || foundStudent.classes,
      gender: gender || foundStudent.gender,
      major_id: major_id || foundStudent.major_id
    });
    
    res.status(200).json({ message: 'Student berhasil diperbarui', student: foundStudent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteStudent = async (req, res) => {
  try {
    const id = req.params.id;
    
    const foundStudent = await student.findByPk(id);
    
    if (!foundStudent) {
      return res.status(404).json({ message: 'Student tidak ditemukan' });
    }
    
    await foundStudent.destroy();
    
    res.status(200).json({ message: 'Student berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};