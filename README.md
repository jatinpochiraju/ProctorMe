#  ProctorMe: AI-Powered Exam Integrity Platform

ProctorMe is a state-of-the-art, full-stack examination platform designed to ensure academic integrity through advanced AI-driven proctoring. By leveraging real-time computer vision and behavioral analysis, ProctorMe provides a secure and reliable environment for remote assessments.

---

##  Key Features

###  AI-Driven Proctoring
*   **Real-time Face Tracking:** Uses TensorFlow.js to monitor the student's presence and position.
*   **Violation Detection:** Automatically detects and logs suspicious activities:
    *   Multiple faces in the camera frame.
    *   No face detected.
    *   Gaze deviation (looking away from the screen).
    *   Tab switching or browser blur detection.
*   **Automatic Submission:** Configurable violation thresholds that trigger automatic exam submission to prevent cheating.

###  Exam Management
*   **Dynamic Question Navigation:** Students can skip, bookmark, and jump between questions easily.
*   **Rich Question Bank:** Supports complex technical questions with multiple-choice options.
*   **Timed Assessments:** Integrated countdown timers with persistent state across refreshes.

###  Admin Dashboard
*   **User Management:** Oversee student registrations and roles.
*   **Exam Orchestration:** Create, edit, and schedule exams with ease.
*   **Detailed Analytics:** Review student performance, time taken, and proctoring violation logs.

###  Security & Reliability
*   **JWT Authentication:** Secure login and session management for both students and administrators.
*   **Pre-exam Verification:** Mandatory camera and face verification before starting the assessment.

---

##  Tech Stack

### Frontend
*   **Framework:** React.js (Vite)
*   **State Management:** Redux Toolkit
*   **Styling:** Custom CSS (Modern UI/UX)
*   **AI/ML:** TensorFlow.js (@tensorflow-models/blazeface, face-landmarks-detection)
*   **Routing:** React Router DOM

### Backend
*   **Framework:** FastAPI (Python)
*   **Database:** SQLite (SQLAlchemy ORM)
*   **Security:** Passlib (Bcrypt), Python-Jose (JWT)
*   **Validation:** Pydantic

---

##  Installation & Setup

### Prerequisites
*   Python 3.8+
*   Node.js 16+
*   npm or yarn

### 1. Backend Setup
```bash
cd backend
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed the database (Optional - for sample data)
python seed_db.py
python seed_sanfoundry.py

# Start the server
python main.py
```
The API will be available at `http://localhost:8000`.

### 2. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Start the development server
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 📂 Project Structure

```
.
├── backend/
│   ├── main.py            # FastAPI entry point
│   ├── models.py          # SQLAlchemy models
│   ├── schemas.py         # Pydantic schemas
│   ├── routers/           # API routes (auth, exam, admin)
│   ├── database.py        # DB configuration
│   └── seed_*.py          # Database seeding scripts
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages (Admin, Exam, Login)
│   │   ├── proctoring/    # AI monitoring logic
│   │   └── redux/         # Global state management
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

##  How It Works

1.  **Login/Register:** Students and Admins authenticate via secure JWT-based login.
2.  **Exam Selection:** Students view available exams and select one to start.
3.  **Proctoring Setup:** The system verifies the camera feed and ensures the student's face is clearly visible.
4.  **The Exam:** While taking the exam, the system continuously monitors the student. Any violations are logged and displayed to the student as warnings.
5.  **Submission:** Upon completion or exceeding violation limits, the exam is submitted, and results are calculated instantly.
6.  **Review:** Admins can review the results and violation logs in the Admin Dashboard.

---

##  License
This project is licensed under the MIT License - see the LICENSE file for details.

