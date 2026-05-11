# 💸 Ta-Cash | Premium Mobile Financial Service (MFS) Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://ta-cash-sigma.vercel.app)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**Ta-Cash** is a high-performance, secure Mobile Financial Service (MFS) application. Following a major 2026 overhaul, it now features a premium "Fintech Design System" with integrated fraud detection, official PDF receipt generation, and real-time dashboard analytics.

---

## 💎 New in the 2026 Modernization

### 🎨 Premium Fintech Design System
- **Sleek & Luminous Dark Mode**: High-contrast dark theme with emerald highlights.
* **Clean & Trustworthy Light Mode**: Mint-based soft white theme for maximum legibility.
- **Glassmorphism UI**: Modern cards with blurred backgrounds, deep gradients, and subtle micro-animations.

### 📄 Official PDF Receipt Engine
- **One-Click Downloads**: Professional computer-generated receipts for every transaction.
- **Authorized Documentation**: Includes transaction IDs, settlement timestamps, and digital security footers.

### 🛡️ Fraud Detection & Security
- **Real-time Velocity Monitoring**: Automatically flags users making more than 5 transactions in 15 minutes.
- **High-Volume Protection**: Flags and locks transactions exceeding $5,000 for manual Admin review.
- **Identity Access Control**: Advanced user/agent status management with hover-reveal controls.

---

## 🚀 Core Features

### 👤 User Capabilities
- **Instant Transfers**: Send Money, Cash-In, and Cash-Out with secure PIN verification.
- **Asset Growth Tracking**: Create and manage dynamic saving goals with visual progress tracking.
- **Financial Pulse**: Real-time cashflow charts and monthly income/expense analysis.
- **Money Requests**: Request assets from other users via a secure request pipeline.

### 👮 Admin & Agent Power
- **Agent Desk**: Dedicated transaction management center for agents to settle client requests.
- **System Command**: Toggle platform-wide maintenance mode and manage global revenue settings.
- **Live Security Audit**: Unalterable history of all administrative and security-critical events.
- **Global Volume Analysis**: Interactive charts monitoring total platform volume and user growth.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS (Modern Theme Engine) |
| **Backend** | Node.js, Express.js (Fraud Detection Engine) |
| **Database** | MongoDB Atlas |
| **Auth** | JWT, Bcrypt.js, Secure Interceptors |
| **Reporting** | jsPDF (Receipt Engine) |
| **Visuals** | Recharts, Lottie, Framer Motion |
| **State** | TanStack Query (React Query) |

---

## ⚙️ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/TanveerAhmed4545/ta-Cash-Client.git
cd ta-cash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the server directory:
```env
DB_USER=your_db_user
DB_PASS=your_db_password
ACCESS_TOKEN_SECRET=your_jwt_secret
```

### 3. Run Development
```bash
npm run dev
```

---

## 🛡️ Security Architecture
- **PIN Hashing**: Multi-round Bcrypt hashing for all transaction secrets.
- **Request Interception**: Secure injection of authorization headers with 401/403 auto-logout.
- **RBAC**: Strict role-based permissions (Admin, Agent, User).
- **Vercel Guard**: Production-grade serverless deployment with automated CI/CD.

---

## 🔗 Live Infrastructure
- **Live Client**: [ta-cash-sigma.vercel.app](https://ta-cash-sigma.vercel.app)
- **Live API**: [ta-cash-server.vercel.app](https://ta-cash-server.vercel.app)

---
*Developed with ❤️ by Tanveer Ahmed. Modernized by Antigravity AI.*
