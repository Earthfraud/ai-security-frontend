# 🛡️ AI Sentry: Real-Time Facial Recognition & Security Dashboard

A full-stack, AI-powered web application designed for automated attendance tracking and security monitoring. This system uses a live camera feed to detect, recognize, and log users in real-time, storing all activity securely in a cloud database.

![Project Status](https://img.shields.io/badge/Status-Live-brightgreen)
![Python](https://img.shields.io/badge/Python-FastAPI-blue)
![React](https://img.shields.io/badge/React-Vite-cyan)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

---

## 🚀 Live Demo
* **Frontend:** = https://ai-security-frontend.vercel.app/
* **Backend API:** = https://ai-security-backend-wyyl.onrender.com

## ✨ Key Features
* **Real-Time Biometric Scanning:** Uses OpenCV to capture live video frames and detect faces in milliseconds.
* **Smart Recognition:** Integrates the lightweight `SFace` model via DeepFace to accurately match faces against a registered database.
* **Cloud Database Logging:** Automatically records "Recognized" attendances and "Unknown Person" security alerts to a MongoDB Atlas cluster.
* **Admin Dashboard:** A responsive React UI to monitor live stats, view recent scan logs, and manage registered identities.
* **Secure Access Control:** Features a password-protected route to permanently revoke user access and delete biometric data.
* **Cloud-Optimized:** Specifically engineered to run in low-memory cloud environments (like Render's free tier) by bypassing heavy TensorFlow RAM usage.

## 🛠️ Technology Stack
**Frontend:**
* React.js (Vite)
* Tailwind CSS
* HTML5 Canvas & WebRTC (Live Camera Feed)

**Backend:**
* Python 3
* FastAPI (RESTful API routing)
* OpenCV (Face detection)
* DeepFace (Facial recognition - SFace model)
* PyMongo (Database connection)

**Infrastructure:**
* Database: MongoDB Atlas
* Frontend Hosting: Vercel
* Backend Hosting: Render

---

## 💻 Local Setup & Installation

If you want to run this project on your local machine, follow these steps:

### 1. Backend Setup
```bash
# Clone the repository
git clone [https://github.com/YourUsername/ai-security-backend.git](https://github.com/YourUsername/ai-security-backend.git)
cd ai-security-backend

# Create a virtual environment
python -m venv venv
source venv/Scripts/activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Create a .env file and add your MongoDB credentials
echo "MONGO_URI=your_mongodb_connection_string" > .env
echo "ADMIN_PASSWORD=your_secure_password" >> .env

# Run the FastAPI server
uvicorn main:app --reload