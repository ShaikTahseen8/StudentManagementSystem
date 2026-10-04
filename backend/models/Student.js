const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  collegeId: { type: String, required: true },
  course: { type: String, default: 'Computer Science' },
  department: { type: String, default: 'Engineering & Technology' },
  semester: { type: String, default: 'Semester 4' },
  phone: { type: String, default: '+91 98765 43210' },
  gender: { type: String, default: 'Other' },
  password: { type: String, default: 'student123' },
  cgpa: { type: String, default: '8.5' },
  attendance: { type: Number, default: 75 },
  status: { type: String, default: 'Active' },
  feeStatus: { type: String, default: 'Paid' },
  enrolledCourses: [{
    code: String,
    title: String,
    credits: Number,
    grade: String,
    score: Number,
    instructor: String
  }]
}, { timestamps: true });

// Pre-save hook to auto calculate status based on 60% rule and maintain name
studentSchema.pre('save', function(next) {
  if (this.firstName && this.lastName) {
    this.name = `${this.firstName} ${this.lastName}`.trim();
  } else if (this.firstName && !this.lastName) {
    this.name = this.firstName;
  }
  if (this.attendance !== undefined && this.attendance !== null) {
    this.status = Number(this.attendance) >= 60 ? 'Active' : 'Inactive';
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);