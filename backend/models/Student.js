const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, default: '' },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  collegeId: { type: String, required: true },
  course: { 
    type: String, 
    required: true,
    enum: ['Pharmacy', 'MBBS', 'B.Tech', 'M.Tech', 'MBA', 'Computer Science', 'BBA', 'Nursing', 'Data Science', 'Mechanical Engineering'],
    default: 'B.Tech' 
  },
  academicYear: { type: String, default: '2nd Year' },
  semester: { type: String, default: 'Semester 3' },
  cgpa: { type: String, default: '8.5' },
  attendance: { type: Number, default: 75 },
  status: { type: String, default: 'Active' },
  feeStatus: { type: String, enum: ['Paid', 'Not Paid', 'Pending'], default: 'Paid' },
  password: { type: String, default: 'student123' },
  enrolledCourses: [{
    code: String,
    title: String,
    credits: Number,
    grade: String,
    score: Number,
    instructor: String
  }]
}, { timestamps: true });

// Pre-save hook: compute full name and 60% Attendance Rule (Active / Deactive)
studentSchema.pre('save', function(next) {
  if (this.firstName && this.lastName) {
    this.name = `${this.firstName} ${this.lastName}`.trim();
  } else if (this.firstName) {
    this.name = this.firstName;
  }
  if (this.attendance !== undefined && this.attendance !== null) {
    this.status = Number(this.attendance) >= 60 ? 'Active' : 'Deactive';
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);