# 💸 Ta-Cash | Modern Mobile Financial Service (MFS) Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://ta-cash-sigma.vercel.app)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**Ta-Cash** is a premium, high-performance Mobile Financial Service (MFS) application designed to provide seamless, secure, and lightning-fast financial transactions. From sending money to tracking saving goals and advanced admin analytics, Ta-Cash is built with a focus on user experience and robust security.

---

## 🚀 Key Features

### 👤 User Capabilities
- **Instant Transactions**: Securely Send Money, Cash-In, and Cash-Out.
- **Dynamic Saving Plans**: Create, track, and manage saving goals with real-time progress bars.
- **Transaction History**: Comprehensive log of all financial activities with status tracking.
- **Smart Notifications**: Real-time alerts for all account activities.
- **Multi-tier Limits**: Dynamic daily limits based on user tiers (Silver, Gold, Platinum).

### 👮 Admin Power
- **Live Analytics Dashboard**: Monitor total revenue, active users, and transaction volumes via interactive charts.
- **System Control**: Toggle Maintenance Mode and manage global system settings.
- **User Management**: Approve/block users and agents, and update roles.
- **Audit Logs**: Deep visibility into administrative actions for security and accountability.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, DaisyUI |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Auth** | JSON Web Tokens (JWT), Bcrypt.js |
| **Charts** | Recharts |
| **State Management** | TanStack Query (React Query) |
| **UI Components** | SweetAlert2, React Hot Toast, React Icons |

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB Atlas Account

### 1. Clone the repository
```bash
git clone https://github.com/TanveerAhmed4545/ta-Cash-Client.git
cd ta-cash
```

### 2. Backend Setup
```bash
cd ta-Cash-Server
npm install
# Create a .env file and add your credentials
npm start
```

### 3. Frontend Setup
```bash
cd ta-Cash-Client
npm install
npm run dev
```

---

## 🛡️ Security
Ta-Cash prioritizes security with:
- **JWT Authentication**: Secure token-based access.
- **PIN Hashing**: All transaction pins are securely hashed using Bcrypt.
- **Axios Interceptors**: Secure injection of authorization headers.
- **Role-based Access Control (RBAC)**: Strict permissions for Admin, Agent, and User roles.

---

## 🔗 Links
- **Live Client**: [ta-cash-sigma.vercel.app](https://ta-cash-sigma.vercel.app)
- **Live API**: [ta-cash-server.vercel.app](https://ta-cash-server.vercel.app)

---

## 👨‍💻 Admin Credentials (Demo)
- **Email**: `hero@gmail.com`
- **Password**: `12345`

---
*Developed with ❤️ by Tanveer Ahmed.*
