# 🚀 Career-Developer-AI – The All-in-One AI Career Architect

<div align="center">

![CareerDev AI Logo](https://img.shields.io/badge/CareerDev--AI-Under%20Development-orange?style=for-the-badge&logo=rocket&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini%20Pro-blue?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

**🚨 An intelligent ecosystem designed to guide students and professionals through their career journey—from resume building to placement success.**

[🚧 Project Status](#-current-status-wip) • [🤖 AI Features](#-ai-core-features) • [🛠️ Tech Stack](#%EF%B8%8F-tech-stack) • [🤝 Contributing](#-how-to-contribute)

---

</div>

## ⚠️ Current Status: Work In Progress (WIP)

This project is **currently under active development**. Many features are in the prototype stage or under implementation. Contributions and feedback are welcome as we move toward a stable release.

---

## ✨ Features & Modules

Career-Developer-AI is built to be a comprehensive career companion.

### 🤖 AI Core Features (Powered by Gemini Pro)

| Feature | Description | Status |
| :--- | :--- | :--- |
| 📄 **AI Resume Analyzer** | Scans resumes for ATS compatibility and provides score-based feedback. | 🏗️ Building |
| 💬 **Career AI Chat** | A specialized assistant to answer career path & industry questions. | ✅ Beta |
| 🎯 **Placement Prep** | AI-generated mock interview questions tailored to specific roles. | 🏗️ Building |
| 🛠️ **Skill Roadmap** | Generates custom learning paths based on your dream job. | 🏗️ Building |
| 🏆 **Hackathon Tracker** | Suggests upcoming hackathons based on user's skill set. | 🏗️ Building |

### 🛠️ Other Modules
- **Alumni Network:** Connect with seniors and industry professionals.
- **Higher Studies:** Specialized guidance for MS, MBA, and PhD paths.
- **Unified Dashboard:** Track your progress across all career-related activities.

---

## 🏗️ Project Structure

```bash
📦 careerdev-ai
├── 📂 prisma/                # Database schema and migrations
├── 📂 src/
│   ├── 📂 app/               # Next.js App Router (Main Modules)
│   │   ├── 📂 admin/         # Admin Management
│   │   ├── 📂 ai-chat/       # Gemini AI Chat Interface
│   │   ├── 📂 placement-prep/# Interview Preparation logic
│   │   ├── 📂 resume-analyzer/# File upload & AI parsing
│   │   └── 📂 api/           # Backend endpoints
│   ├── 📂 components/        # Reusable UI Components
│   └── 📂 lib/               # Utility functions (Gemini config, Prisma)
├── 📜 package.json
└── 📜 tailwind.config.js

🔧 Environment Configuration
To run this project locally, create a .env file in the root directory:
# 🤖 Google Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# 🗄️ Database (PostgreSQL/MySQL)
DATABASE_URL="your_database_connection_url"

# 🔐 Authentication (NextAuth)
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

🚀 Development Setup
📥 Clone and Install
git clone [https://github.com/Lucky-939/Career-Developer-AI.git](https://github.com/Lucky-939/Career-Developer-AI.git)
cd Career-Developer-AI
npm install

🗄️ Database Setup (Prisma)
npx prisma generate
npx prisma db push

⚡ Start Development Server
npm run dev
🟢 Server Status: Available at http://localhost:3000

🛠️ Tech Stack
<div align="center">

Frontend & Backend
Intelligence & Services
</div>

🤝 How to Contribute
Since this project is in the early development phase, we highly value contributions!

Fork the Project

Create a Feature Branch (git checkout -b feature/NewModule)

Commit Your Changes (git commit -m 'Add NewModule')

Push to the Branch (git push origin feature/NewModule)

Open a Pull Request

📜 License
Distributed under the MIT License. See LICENSE for details.

<div align="center">

⭐ Give us a star to follow the development journey!

Author: Lucky Bhoir
💬 LinkedIn • 🐛 Report Bug

</div>
