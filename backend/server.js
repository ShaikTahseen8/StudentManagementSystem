const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[API Request] ${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://shaiktahaseen712005_db_user:Sunair0726@cluster0.qip065a.mongodb.net/StudentDB?retryWrites=true&w=majority&appName=Cluster0";

// Initial Demo Seed Data matching exact requested courses: Pharmacy, MBBS, B.Tech, M.Tech, MBA
const initialSeedData = [
  {
    firstName: "Shaik",
    lastName: "Tahaseen",
    name: "Shaik Tahaseen",
    email: "tahaseen@example.com",
    collegeId: "3178",
    course: "B.Tech",
    academicYear: "3rd Year",
    semester: "Semester 6",
    cgpa: "9.2",
    attendance: 88,
    status: "Active",
    feeStatus: "Paid",
    password: "student123",
    enrolledCourses: [
      { code: "BT601", title: "Advanced Software Engineering", credits: 4, grade: "A+", score: 95, instructor: "Dr. A. Sharma" },
      { code: "BT602", title: "Cloud Computing & DevOps", credits: 4, grade: "A", score: 90, instructor: "Prof. R. Patel" },
      { code: "BT603", title: "Artificial Intelligence", credits: 3, grade: "A+", score: 94, instructor: "Dr. K. Iyer" }
    ]
  },
  {
    firstName: "Aarav",
    lastName: "Verma",
    name: "Aarav Verma",
    email: "aarav.verma@example.com",
    collegeId: "2104",
    course: "Pharmacy",
    academicYear: "2nd Year",
    semester: "Semester 4",
    cgpa: "8.7",
    attendance: 78,
    status: "Active",
    feeStatus: "Paid",
    password: "student123",
    enrolledCourses: [
      { code: "PH401", title: "Medicinal Chemistry", credits: 4, grade: "A", score: 86, instructor: "Dr. M. Gupta" },
      { code: "PH402", title: "Pharmacology II", credits: 4, grade: "B+", score: 79, instructor: "Dr. H. Joshi" }
    ]
  },
  {
    firstName: "Priya",
    lastName: "Sharma",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    collegeId: "1055",
    course: "MBBS",
    academicYear: "1st Year",
    semester: "Semester 2",
    cgpa: "7.9",
    attendance: 54,
    status: "Deactive",
    feeStatus: "Not Paid",
    password: "student123",
    enrolledCourses: [
      { code: "MB101", title: "Human Anatomy & Physiology", credits: 5, grade: "B", score: 72, instructor: "Dr. E. Khan" },
      { code: "MB102", title: "Biochemistry", credits: 4, grade: "B+", score: 74, instructor: "Dr. P. Nair" }
    ]
  },
  {
    firstName: "Ananya",
    lastName: "Das",
    name: "Ananya Das",
    email: "ananya.das@example.com",
    collegeId: "4092",
    course: "MBA",
    academicYear: "2nd Year",
    semester: "Semester 4",
    cgpa: "9.0",
    attendance: 92,
    status: "Active",
    feeStatus: "Paid",
    password: "student123",
    enrolledCourses: [
      { code: "MB401", title: "Strategic Management", credits: 4, grade: "A+", score: 96, instructor: "Prof. T. Agarwal" },
      { code: "MB402", title: "Corporate Finance", credits: 3, grade: "A", score: 91, instructor: "Prof. N. Deshmukh" }
    ]
  },
  {
    firstName: "Rohan",
    lastName: "Mehta",
    name: "Rohan Mehta",
    email: "rohan.mehta@example.com",
    collegeId: "5120",
    course: "M.Tech",
    academicYear: "1st Year",
    semester: "Semester 2",
    cgpa: "6.8",
    attendance: 48,
    status: "Deactive",
    feeStatus: "Not Paid",
    password: "student123",
    enrolledCourses: [
      { code: "MT201", title: "Distributed Database Systems", credits: 4, grade: "C+", score: 68, instructor: "Dr. V. Menon" }
    ]
  }
];

// Connect Atlas with Auto Seeder
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Atlas Connected - StudentDB LIVE');
    try {
      const count = await Student.countDocuments();
      if (count === 0) {
        console.log('🌱 Seeding initial student records for Pharmacy, MBBS, B.Tech, M.Tech, MBA...');
        await Student.insertMany(initialSeedData);
        console.log(`✅ Seeded ${initialSeedData.length} records successfully.`);
      } else {
        console.log(`📊 Found ${count} student records in MongoDB Atlas.`);
      }
    } catch (seedErr) {
      console.warn('⚠️ Seeding check error:', seedErr.message);
    }
  })
  .catch(err => {
    console.error('❌ Atlas Connection Error:', err.message);
  });

// Health check
app.get('/', (req, res) => {
  res.json({
    status: true,
    message: 'EduCore Student Management System API is LIVE',
    database: 'StudentDB'
  });
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  console.log(`[Auth] Admin login attempt for: ${email}`);
  
  if ((email === 'admin@gmail.com' && password === 'admin123') ||
      (email === 'admin@sms.edu' && password === 'admin123') ||
      (email === 'admin' && password === 'admin') ||
      (email === 'admin' && password === 'admin123')) {
    return res.json({
      success: true,
      message: 'Admin login successful',
      token: 'admin-jwt-token-' + Date.now(),
      admin: {
        id: 'ADM-001',
        name: 'Administrator',
        email: email.includes('@') ? email : 'admin@gmail.com',
        role: 'admin'
      }
    });
  }
  
  res.status(401).json({
    success: false,
    message: 'Invalid administrator credentials'
  });
});

// Student Login
app.post('/api/students/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[Auth] Student login attempt for: ${email}`);

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const student = await Student.findOne({ email: cleanEmail });
    
    if (!student) {
      return res.status(401).json({ success: false, message: 'No student account found with this email' });
    }

    if (student.password && student.password !== password) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    const studentObj = student.toObject();
    delete studentObj.password;

    res.json({
      success: true,
      message: 'Student login successful',
      token: 'student-jwt-' + student._id,
      student: studentObj
    });
  } catch (err) {
    console.error('[Auth Error]', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Student Registration
app.post('/api/students/register', async (req, res) => {
  try {
    const data = req.body;
    console.log(`[Register] Registration for: ${data.email}`);

    if (!data.email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const cleanEmail = data.email.toLowerCase().trim();
    const existing = await Student.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A student with this email is already registered' });
    }

    const attendanceVal = Number(data.attendance !== undefined ? data.attendance : 75);
    const fullName = data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Student';
    const autoStatus = attendanceVal >= 60 ? 'Active' : 'Deactive';

    const newStudent = new Student({
      firstName: data.firstName || fullName.split(' ')[0] || 'Student',
      lastName: data.lastName || fullName.split(' ').slice(1).join(' ') || '',
      name: fullName,
      email: cleanEmail,
      collegeId: data.collegeId || '3178',
      course: data.course || 'B.Tech',
      academicYear: data.academicYear || '1st Year',
      semester: data.semester || 'Semester 1',
      cgpa: data.cgpa || '8.5',
      attendance: attendanceVal,
      status: autoStatus,
      feeStatus: data.feeStatus || 'Paid',
      password: data.password || 'student123',
      enrolledCourses: data.enrolledCourses || [
        { code: "CORE101", title: "Fundamentals of " + (data.course || 'Core'), credits: 4, grade: "A", score: 85, instructor: "Faculty Coordinator" }
      ]
    });

    const saved = await newStudent.save();
    const resStudent = saved.toObject();
    delete resStudent.password;

    res.status(201).json({
      success: true,
      message: 'Registered successfully',
      student: resStudent
    });
  } catch (err) {
    console.error('[Register Error]', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin Add Student & General POST
app.post('/api/students', async (req, res) => {
  try {
    const data = req.body;
    if (!data.email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const cleanEmail = data.email.toLowerCase().trim();
    const existing = await Student.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const attendanceVal = Number(data.attendance !== undefined ? data.attendance : 75);
    const fullName = data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Student';
    const autoStatus = attendanceVal >= 60 ? 'Active' : 'Deactive';

    const newStudent = new Student({
      firstName: data.firstName || fullName.split(' ')[0] || 'Student',
      lastName: data.lastName || fullName.split(' ').slice(1).join(' ') || '',
      name: fullName,
      email: cleanEmail,
      collegeId: data.collegeId || '3178',
      course: data.course || 'B.Tech',
      academicYear: data.academicYear || '1st Year',
      semester: data.semester || 'Semester 1',
      cgpa: data.cgpa || '8.5',
      attendance: attendanceVal,
      status: autoStatus,
      feeStatus: data.feeStatus || 'Paid',
      password: data.password || 'student123'
    });

    const saved = await newStudent.save();
    res.status(201).json({ success: true, message: 'Student created successfully', student: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET All Students
app.get('/api/students', async (req, res) => {
  try {
    const { search, course, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { collegeId: { $regex: search, $options: 'i' } }
      ];
    }

    if (course && course !== 'All') {
      query.course = course;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const students = await Student.find(query).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET Stats
app.get('/api/stats', async (req, res) => {
  try {
    const students = await Student.find();
    const total = students.length;
    const activeCount = students.filter(s => Number(s.attendance || 0) >= 60).length;
    const inactiveCount = total - activeCount;
    
    const totalCgpa = students.reduce((acc, s) => acc + (parseFloat(s.cgpa) || 0), 0);
    const avgCgpa = total > 0 ? (totalCgpa / total).toFixed(2) : '0.00';
    
    const totalAtt = students.reduce((acc, s) => acc + (Number(s.attendance) || 0), 0);
    const avgAttendance = total > 0 ? (totalAtt / total).toFixed(1) : '0.0';

    const courses = {};
    students.forEach(s => {
      const c = s.course || 'Unassigned';
      courses[c] = (courses[c] || 0) + 1;
    });

    res.json({
      total,
      activeCount,
      inactiveCount,
      avgCgpa,
      avgAttendance,
      courseBreakdown: courses
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET Single Student
app.get('/api/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let student = null;
    
    if (mongoose.Types.ObjectId.isValid(id)) {
      student = await Student.findById(id);
    }
    if (!student) {
      student = await Student.findOne({ collegeId: id }) || await Student.findOne({ email: id });
    }

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT Update Student
app.put('/api/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };

    if (updateData.attendance !== undefined) {
      updateData.attendance = Number(updateData.attendance);
      updateData.status = updateData.attendance >= 60 ? 'Active' : 'Deactive';
    }

    if (updateData.firstName || updateData.lastName) {
      updateData.name = `${updateData.firstName || ''} ${updateData.lastName || ''}`.trim();
    }

    let updated = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await Student.findByIdAndUpdate(id, updateData, { new: true });
    } else {
      updated = await Student.findOneAndUpdate({ collegeId: id }, updateData, { new: true });
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Student not found to update' });
    }

    res.json({ success: true, message: 'Student updated successfully', student: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE Student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let deleted = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Student.findByIdAndDelete(id);
    } else {
      deleted = await Student.findOneAndDelete({ collegeId: id });
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Student not found to delete' });
    }

    res.json({ success: true, message: 'Student deleted successfully', deletedId: id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Backend LIVE on http://localhost:${PORT}`);
});