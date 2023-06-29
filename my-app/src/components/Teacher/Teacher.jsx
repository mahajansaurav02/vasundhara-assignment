import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Teacher = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });

      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createStudent = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        'http://localhost:5000/api/students',
        { name, teacher: localStorage.getItem('teacherId') }, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        }
      );

      setName('');
      fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });

      fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const updateStudent = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/students/${selectedStudent._id}`,
        selectedStudent,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        }
      );

      fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div>
      <h2>Create Student</h2>
      <form onSubmit={createStudent}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button type="submit">Create</button>
      </form>

      <h2>Student List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Teacher</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.teacher}</td>
              <td>
                <button onClick={() => handleSelectStudent(student)}>Edit</button>
                <button onClick={() => deleteStudent(student._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedStudent && (
        <div>
          <h2>Edit Student</h2>
          <form onSubmit={updateStudent}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={selectedStudent.name}
                onChange={(e) =>
                  setSelectedStudent({ ...selectedStudent, name: e.target.value })
                }
              />
            </div>
            <button type="submit">Update</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Teacher;
