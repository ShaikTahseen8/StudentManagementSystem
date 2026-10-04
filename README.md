# 🎓 EduCore — Next-Gen Student Management System (SMS)

An end-to-end, high-performance Student Management System built with Angular 22, Node.js/Express, MongoDB Atlas, and a responsive glassmorphic UI design system.

---

## 🚀 Key Features & Highlights

### 🛡️ 1. Administrator Portal (`/admin/dashboard`)
- **Real-Time Statistical KPI Bar**:
  - Total Enrolled Students
  - Active & Inactive Student counts (auto-enforced via **60% Attendance Compliance Rule**)
  - Institutional Average CGPA
  - Campus Overall Attendance Health Rate
- **Live Search & Multidimensional Filtering**:
  - Real-time search across Name, Email, College ID, and Course
  - Filter by Degree/Program (*Computer Science, Pharmacy, BBA, Nursing, Data Science, Mechanical*)
  - Filter by Academic Status (*Active ≥ 60%*, *Inactive < 60%*)
  - Multi-column dynamic sorting (*Name, CGPA, Attendance %, College ID*)
- **Interactive Student Directory**:
  - Color-coded Attendance Progress Gauges (🟢 Safe ≥ 75%, 🟡 Warning 60–74%, 🔴 Critical < 60%)
  - One-click Micro-Attendance Adjusters (**+5%** and **-5%** buttons) with live status recalculation
  - Status Pills with icon indicators
- **Full CRUD Management**:
  - Add Student Modal with live slider & instant 60% rule calculation
  - Edit Student Modal with complete field validation
  - Student Transcript & Course Details Modal
  - Delete Student with confirmation safeguards
- **Data Export & Reporting**:
  - Export filtered records to **CSV** spreadsheet
  - Export complete database backup to **JSON**

---

### 🎓 2. Student Portal (`/student/dashboard`)
- **Student Hero Identity Card**:
  - Displays Avatar initials, College Roll ID, Enrolled Program, Academic Semester, Contact info, and Compliance Status.
- **Academic Performance Index**:
  - Cumulative GPA (CGPA) with institutional grading scale (`A+`, `A`, `B+`, `B`, `C`, `Pass`).
  - Attendance Health Rate with minimum 60% compliance requirement notice.
  - Enrolled Curriculum Load & Semester Credits.
  - Fee Status (*Paid / Pending Clearance*).
- **Smart Attendance Health Advisor**:
  - Real-time advisory algorithm alerting students to safe distinction zones (≥ 75%) or calculating consecutive lectures required to avoid debarment.
- **Enrolled Semester Curriculum & Transcript**:
  - Detailed course table with Course Code, Subject Title, Credits, Internal/Exam Marks, Letter Grades, and Assigned Faculty.
- **Digital Student ID Card**:
  - Formatted printable digital ID card with barcode/credential simulation.
- **Self-Service Profile Edit**:
  - Update contact telephone, academic semester, and department.

---

### ⚡ 3. Intelligent Dual-Mode Hybrid Architecture
- **Backend Connected Mode**: Connects to Node.js / Express API (`http://localhost:3000`) and syncs in real-time with **MongoDB Atlas**.
- **Offline & GitHub Pages Standalone Mode**: When running statically on GitHub Pages or if backend is unreachable, the system activates a **Reactive RxJS LocalStorage Database Engine** pre-seeded with realistic student records. All features (CRUD, search, filtering, CGPA calculations, exports, and login) function offline with zero blank screens or failed requests!
- **Real-Time Status Indicator**: Dynamic status pill in the header navbar displaying live MongoDB Atlas connection state or standalone offline mode.
- **Console Transparency**: Clear console logs detailing every query, sync, and lifecycle event.

---

## 🔑 Demo Access & Default Credentials

| Portal | Role | Email | Password |
| :--- | :--- | :--- | :--- |
| **Admin Portal** | Administrator | `admin@gmail.com` | `admin123` |
| **Student Portal** | Student (CS) | `tahaseen@example.com` | `student123` |
| **Student Portal** | Student (Pharmacy) | `aarav.verma@example.com` | `student123` |
| **Student Portal** | Student (BBA) | `priya.sharma@example.com` | `student123` |

*(Quick 1-click Demo auto-fill buttons are provided on both login screens!)*

---

## 🛠️ Local Development Setup

### 1. Start Backend API & MongoDB Atlas
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:3000`*

### 2. Start Frontend Angular App
```bash
cd frontend
npm install
npm start
```
*Frontend runs on `http://localhost:4200`*

---

## 🌐 GitHub Pages Deployment Guide

To deploy this project to GitHub Pages:

### Step 1: Build the Frontend for GitHub Pages
```bash
cd frontend
npm run build:gh
```
*(This compiles optimized production bundles into `frontend/dist/frontend/browser` with relative base-href).*

### Step 2: Push to GitHub Pages branch
You can deploy using GitHub's built-in Pages settings (deploy from branch `/dist/frontend/browser` or `docs/`) or using the `angular-cli-ghpages` utility:

```bash
npx angular-cli-ghpages --dir=dist/frontend/browser
```

Once published, your app will be live and interactive on:
`https://<your-username>.github.io/<repository-name>/`
