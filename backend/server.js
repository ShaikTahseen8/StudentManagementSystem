const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend
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

// MongoDB Atlas URI from .env or fallback
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://shaiktahaseen712005_db_user:Sunair0726@cluster0.qip065a.mongodb.net/StudentDB?retryWrites=true&w=majority&appName=Cluster0";

// Initial Demo Seed Data
const initialSeedData = [
  {
    firstName: "Shaik",
    lastName: "Tahaseen",
    name: "Shaik Tahaseen",
    email: "tahaseen@example.com",
    collegeId: "SMS-2024-001",
    course: "Computer Science",
    department: "Computer Science & Engineering",
    semester: "Semester 6",
    phone: "+91 98765 43210",
    gender: "Male",
    password: "student123",
    cgpa: "9.2",
    attendance: 88,
    status: "Active",
    feeStatus: "Paid",
    enrolledCourses: [
      { code: "CS601", title: "Full Stack Web Architecture", credits: 4, grade: "A+", score: 94, instructor: "Dr. A. Sharma" },
      { code: "CS602", title: "Distributed Systems & Cloud", credits: 4, grade: "A", score: 89, instructor: "Prof. R. Patel" },
      { code: "CS603", title: "Machine Learning & AI", credits: 3, grade: "A+", score: 96, instructor: "Dr. K. Iyer" },
      { code: "CS604", title: "Database Management Systems", credits: 3, grade: "A", score: 90, instructor: "Prof. S. Rao" }
    ]
  },
  {
    firstName: "Aarav",
    lastName: "Verma",
    name: "Aarav Verma",
    email: "aarav.verma@example.com",
    collegeId: "SMS-2024-002",
    course: "Pharmacy",
    department: "Pharmaceutical Sciences",
    semester: "Semester 4",
    phone: "+91 98234 11223",
    gender: "Male",
    password: "student123",
    cgpa: "8.7",
    attendance: 78,
    status: "Active",
    feeStatus: "Paid",
    enrolledCourses: [
      { code: "PH401", title: "Medicinal Chemistry", credits: 4, grade: "A", score: 86, instructor: "Dr. M. Gupta" },
      { code: "PH402", title: "Pharmacology II", credits: 4, grade: "B+", score: 79, instructor: "Dr. H. Joshi" },
      { code: "PH403", title: "Biopharmaceutics", credits: 3, grade: "A", score: 88, instructor: "Prof. V. Reddy" }
    ]
  },
  {
    firstName: "Priya",
    lastName: "Sharma",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    collegeId: "SMS-2024-003",
    course: "BBA",
    department: "School of Management",
    semester: "Semester 2",
    phone: "+91 97112 33445",
    gender: "Female",
    password: "student123",
    cgpa: "7.9",
    attendance: 54,
    status: "Inactive",
    feeStatus: "Pending",
    enrolledCourses: [
      { code: "BB201", title: "Financial Accounting", credits: 3, grade: "B", score: 72, instructor: "Prof. T. Agarwal" },
      { code: "BB202", title: "Organizational Behavior", credits: 3, grade: "B+", score: 78, instructor: "Dr. E. Khan" },
      { code: "BB203", title: "Marketing Management", credits: 4, grade: "B", score: 74, instructor: "Prof. N. Deshmukh" }
    ]
  },
  {
    firstName: "Ananya",
    lastName: "Das",
    name: "Ananya Das",
    email: "ananya.das@example.com",
    collegeId: "SMS-2024-004",
    course: "Nursing",
    department: "Nursing & Health Sciences",
    semester: "Semester 4",
    phone: "+91 96554 77889",
    gender: "Female",
    password: "student123",
    cgpa: "9.0",
    attendance: 92,
    status: "Active",
    feeStatus: "Paid",
    enrolledCourses: [
      { code: "NR401", title: "Advanced Clinical Practice", credits: 4, grade: "A+", score: 95, instructor: "Dr. P. Nair" },
      { code: "NR402", title: "Patient Care & Ethics", credits: 3, grade: "A", score: 91, instructor: "Prof. L. Joseph" }
    ]
  },
  {
    firstName: "Rohan",
    lastName: "Mehta",
    name: "Rohan Mehta",
    email: "rohan.mehta@example.com",
    collegeId: "SMS-2024-005",
    course: "Data Science",
    department: "School of Computing",
    semester: "Semester 6",
    phone: "+91 98451 22334",
    gender: "Male",
    password: "student123",
    cgpa: "6.8",
    attendance: 48,
    status: "Inactive",
    feeStatus: "Pending",
    enrolledCourses: [
      { code: "DS601", title: "Deep Learning Foundations", credits: 4, grade: "C+", score: 67, instructor: "Dr. V. Menon" },
      { code: "DS602", title: "Big Data Pipelines", credits: 4, grade: "B", score: 70, instructor: "Prof. J. Roy" }
    ]
  }
];

// Connect Atlas with Auto Seeder
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Atlas Connected Successfully - StudentDB LIVE');
    try {
      const count = await Student.countDocuments();
      if (count === 0) {
        console.log('🌱 Database is empty. Seeding realistic starter records...');
        await Student.insertMany(initialSeedData);
        console.log(`✅ Seeded ${initialSeedData.length} starter students successfully.`);
      } else {
        console.log(`📊 Found ${count} existing student records in MongoDB Atlas.`);
      }
    } catch (seedErr) {
      console.warn('⚠️ Seeding check error:', seedErr.message);
    }
  })
  .catch(err => {
    console.error('❌ Atlas Connection Error:', err.message);
    console.log('💡 Note: Frontend runs seamlessly with LocalStorage offline fallback engine.');
  });

// Root / Health Check
app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting/Disconnected';
  res.json({
    status: true,
    message: 'Student Management System API is LIVE',
    database: 'StudentDB',
    dbConnectionState: dbStatus,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: 'GET /',
      stats: 'GET /api/stats',
      students: 'GET /api/students',
      studentById: 'GET /api/students/:id',
      register: 'POST /api/students/register',
      studentLogin: 'POST /api/students/login',
      adminLogin: 'POST /api/admin/login',
      addStudent: 'POST /api/students',
      updateStudent: 'PUT /api/students/:id',
      deleteStudent: 'DELETE /api/students/:id'
    }
  });
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  console.log(`[Auth] Admin login attempt for: ${email}`);
  
  if ((email === 'admin@gmail.com' && password === 'admin123') ||
      (email === 'admin@sms.edu' && password === 'admin123')) {
    return res.json({
      success: true,
      message: 'Admin login successful',
      token: 'admin-jwt-mock-' + Date.now(),
      admin: {
        id: 'ADM-001',
        name: 'Chief Academic Administrator',
        email: email,
        role: 'admin',
        permissions: ['read', 'write', 'delete', 'export']
      }
    });
  }
  
  res.status(401).json({
    success: false,
    message: 'Invalid administrator credentials. Try admin@gmail.com / admin123'
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

    const student = await Student.findOne({ email: email.toLowerCase().trim() });
    
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
      token: 'student-jwt-mock-' + student._id,
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
    console.log(`[Register] Registration attempt: ${data.email}`);

    if (!data.email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const cleanEmail = data.email.toLowerCase().trim();
    const existing = await Student.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A student with this email is already registered' });
    }

    // Prepare student payload
    const attendanceVal = Number(data.attendance || 75);
    const fullName = data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Student';
    const autoStatus = attendanceVal >= 60 ? 'Active' : 'Inactive';

    const newStudent = new Student({
      ...data,
      name: fullName,
      email: cleanEmail,
      collegeId: data.collegeId || 'SMS-' + Math.floor(1000 + Math.random() * 9000),
      attendance: attendanceVal,
      status: autoStatus,
      cgpa: data.cgpa || '8.5',
      course: data.course || 'Computer Science',
      password: data.password || 'student123',
      enrolledCourses: data.enrolledCourses || [
        { code: "CORE101", title: "Fundamentals of " + (data.course || 'Core Subjects'), credits: 4, grade: "A", score: 85, instructor: "Faculty Coordinator" }
      ]
    });

    const saved = await newStudent.save();
    console.log(`✅ Student registered: ${saved.name} (${saved.email})`);
    
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

// Also support POST /api/students for both Admin Create & Student Register
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
    const fullName = data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'New Student';
    const autoStatus = attendanceVal >= 60 ? 'Active' : 'Inactive';

    const newStudent = new Student({
      ...data,
      name: fullName,
      email: cleanEmail,
      collegeId: data.collegeId || 'SMS-' + Math.floor(1000 + Math.random() * 9000),
      attendance: attendanceVal,
      status: autoStatus,
      cgpa: data.cgpa || '8.0'
    });

    const saved = await newStudent.save();
    res.status(201).json({ success: true, message: 'Student created successfully', student: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all students with optional search and course filter
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
    console.log(`[Students Query] Returning ${students.length} students`);
    res.json(students);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET student statistics
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

    // Course breakdown
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

// GET single student
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

// UPDATE student
app.put('/api/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };

    if (updateData.attendance !== undefined) {
      updateData.attendance = Number(updateData.attendance);
      updateData.status = updateData.attendance >= 60 ? 'Active' : 'Inactive';
    }

    if (updateData.firstName || updateData.lastName) {
      updateData.name = `${updateData.firstName || ''} ${updateData.lastName || ''}`.trim();
    }

    let updated = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await Student.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    } else {
      updated = await Student.findOneAndUpdate({ collegeId: id }, updateData, { new: true });
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Student not found to update' });
    }

    console.log(`[Update] Student updated: ${updated.name}`);
    res.json({ success: true, message: 'Student updated successfully', student: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE student
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

    console.log(`[Delete] Student deleted: ${deleted.name} (${deleted.collegeId})`);
    res.json({ success: true, message: 'Student deleted successfully', deletedId: id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Student Management System Backend LIVE on http://localhost:${PORT}`);
  console.log(`📡 Ready for Frontend API calls & MongoDB Atlas connections`);
  console.log(`======================================================\n`);
});