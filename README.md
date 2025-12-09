# 🏨 HostelHub – Smart Hostel Management App

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-lightgrey.svg?style=for-the-badge&logo=apple)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)
![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge)

> **Your ultimate sidekick for stress-free hostel adventures!**

![Banner](./frontend/assets/hostelhub_banner.png)

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Problem & Solution](#-problem--solution)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Demo](#-watch-live-demo)
- [Screenshots](#-screenshots)
- [Environment Variables](#-environment-configuration)
- [Installation](#-installation--quick-start)
- [Folder Structure](#-folder-structure)
- [Documentation & Policy](#-documentation--policy)
- [Roadmap](#-future-scope--roadmap)
- [Author](#-author)

---

## 🚀 About the Project

**HostelHub** is a mobile application designed to digitize hostel administration. It bridges the communication gap between students and wardens by enabling transparency, speed, and better management of daily hostel activities.

From applying for leaves to checking the mess menu or filing a complaint, **HostelHub** brings everything to your fingertips.

---

## 🧩 Problem & Solution

### 🔴 The Problem
Traditional hostel management relies on manual registers, paper forms, and verbal communication. This leads to:
*   Slow approval processes for leaves.
*   Lack of transparency in complaints.
*   Inefficient communication of notices.
*   No centralized feedback system for food quality.

### 🟢 The Solution
**HostelHub** digitizes these processes:
*   **Instant Leaves**: QR-based digital passes approved in seconds.
*   **Trackable Complaints**: Status updates ensure accountability.
*   **Digital Notices**: Push notifications for instant reach.
*   **Data-Driven Mess**: Feedback analytics to improve food quality.

---

## 🌟 Key Features

*   🏙️ **Role-based Dashboard**: Distinct interfaces for **Student** (Resident) and **Warden** (Admin).
*   🎟️ **QR-based Digital Leave Pass**: Apply online; get a time-bound QR code scanned at the gate.
*   🍛 **Smart Mess Menu**: View daily meals and provide 1-tap feedback with analytics.
*   🛠️ **Complaint Tracking**: Upload images of issues, provide descriptions, and track resolution status.
*   🛒 **Hostel Marketplace**: Buy and sell books, gadgets, and essentials within the hostel community.
*   📊 **Polls & Voting**: participate in democratic decision-making for hostel events/rules.
*   📢 **Real-time Notifications**: Never miss an important notice or announcement.
*   🔍 **Lost & Found Board**: Post and find lost items easily.

---

## 🛠 Tech Stack

![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)


---

## 🎥 Watch Live Demo

👉 [https://youtu.be/3d4AHw-Zgcc](https://youtu.be/3d4AHw-Zgcc)

![Demo GIF](./frontend/assets/screenshots/hostelhub_demo.gif)

---

## 📱 Screenshots

| Login Screen | Student Dashboard | Dashboard |
|:---:|:---:|:---:|
| ![Login](./frontend/assets/screenshots/login.jpeg) | ![Student Dashboard](./frontend/assets/screenshots/dashboard1.jpeg) | ![Dashboard](./frontend/assets/screenshots/dashboard2.jpeg) |

| Mess Menu | Complaints | Marketplace |
|:---:|:---:|:---:|
| ![Menu](./frontend/assets/screenshots/mess.jpeg) | ![Complaints](./frontend/assets/screenshots/complaints.jpeg) | ![Market](./frontend/assets/screenshots/market.jpeg) |

---

## 🔑 Environment Configuration

Create a `.env.local` file in both `backend` and `frontend` directories.

### Backend (`/backend/.env.local`)

| Variable | Description | Required | Reference Value |
|----------|-------------|:--------:|-----------------|
| `PORT` | Server Port | No | `5000` |
| `DATABASE_URL` | MySQL Connection String | **Yes** | `mysql://user:pass@host:3306/db` |
| `HOSTELHUB_SECRET_JWT` | Secret Key for JWT | **Yes** | `your_secret_key` |


### Frontend (`/frontend/.env.local`)

| Variable | Description | Value |
|----------|-------------|-------|
| `EXPO_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000/api` |

---

## ⚡ Installation & Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/<MY_USERNAME>/HostelHub.git
cd HostelHub
```

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma db push # or migrate
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## 📂 Folder Structure

```
HostelHub/
├── backend/
│   ├── prisma/             # Database Schema
│   ├── src/
│   │   ├── config/         # Configs (Env, DB)
│   │   ├── controllers/    # Route Logic
│   │   ├── middlewares/    # Auth & Error middlewares
│   │   ├── routes/         # API Routes
│   │   ├── services/       # Business Logic
│   │   └── app.js          # Entry Point
│   └── package.json
│
├── frontend/
│   ├── assets/             # Images & Fonts
│   ├── src/
│   │   ├── api/            # API Client
│   │   ├── components/     # Reusable Components
│   │   ├── context/        # Auth & State Context
│   │   ├── navigation/     # Navigators (Stacks/Tabs)
│   │   ├── screens/        # App Screens
│   │   └── utils/          # Helpers
│   └── package.json
│
└── README.md
```

---

## 📜 Documentation & Policy

Please read the following documents to understand the development standards and project policies:

*   [**Contributing Guidelines**](CONTRIBUTING.md) 🤝
*   [**Code of Conduct**](CODE_OF_CONDUCT.md) 👮
*   [**Security Policy**](SECURITY.md) 🛡️
*   [**License**](LICENSE) ⚖️

---

## 🔮 Future Scope / Roadmap

*   [ ] **Payment Gateway**: Integration for mess fees and rent payments.
*   [ ] **AI Analytics**: Predictive analysis for mess food wastage and demand.
*   [ ] **Biometric Auth**: Fingerprint/FaceID login support.
*   [ ] **Multi-Hostel Support**: Scalable architecture for university-wide deployment.
*   [ ] **Offline Mode**: Local caching for viewing recent notices without internet.

---

## 👤 Author

**Krit Garg**  


[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/kritgarg)
[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/krit--garg/)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:kritg0160@gmail.com)
