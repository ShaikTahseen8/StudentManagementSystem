const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('MongoDB Atlas Connected Successfully!'))
.catch(err=>console.log('DB Connection Error:', err));

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  course: String,
  password: String
});

const Student = mongoose.model('Student', studentSchema);

app.get('/api/students', async (req,res)=>{
  const students = await Student.find();
  res.json(students);
});

app.post('/api/students', async (req,res)=>{
  const student = new Student(req.body);
  await student.save();
  res.json(student);
});

// LOGIN API - Ye missing tha isliye wrong password bol raha tha
app.post('/api/login', async (req,res)=>{
  const { email, password } = req.body;
  const student = await Student.findOne({ email: email });
  if(!student){
    return res.status(400).json({ message: 'User not found' });
  }
  if(student.password !== password){
    return res.status(400).json({ message: 'Wrong password' });
  }
  res.json({ message: 'Login Success', student: student });
});

const PORT = 3000;
app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`);
});