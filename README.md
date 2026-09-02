https://api.dicebear.com/10.x/adventurer/svg?seed=Milo

https://api.dicebear.com/10.x/adventurer/svg?seed=Aneka

# 🌐 lcwkr - Learn Chinese with Kazi Robin

> A scalable, modern, and international **Learning Management System (LMS)** designed specifically for Chinese language learners. 

[![Live Website](https://img.shields.io/badge/Website-Live-brightgreen?style=for-the-badge&logo=vercel)](https://lcwkr.vercel.app/)
[![GitHub Status](https://img.shields.io/badge/GitHub-Active-blue?style=for-the-badge&logo=github)](https://github.com/lcwkr)

---

## 🌟 About The Project
**lcwkr** is a comprehensive, full-stack educational platform built to bridge the gap between global students and expert Chinese language instructors. It provides a seamless virtual classroom experience with advanced role management, interactive course tracking, and localized learning tools.

---

## ✨ Core Features

* **👥 Multi-Role Dashboards:** Separate, secure interfaces for Super Admins, Instructors, and Students.
* **🌍 Multi-Language Support:** Global translation capabilities to cater to international learners.
* **🌓 Theme Customizer:** Built-in Light and Dark mode options for a comfortable study experience.
* **📊 Smart Attendance System:** Students can request class attendance/proof, which instructors can review and grant dynamically.
* **📚 Course & Lesson Management:** Structured modules, video lessons, and resource sharing.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4
* **Backend:** Next.js Route Handlers over a per-feature service layer
* **Database:** MongoDB (Mongoose)

---

## 🧱 Project Structure

Code lives under `src/`, grouped **by domain** rather than by file type. Each
domain is a self-contained module in `src/features/<name>/` (components, data,
models, server logic, types). See [`docs/architecture.md`](docs/architecture.md)
for the directory map, import rules, and how to add a new feature.

```
npm run dev      # start the dev server
npm run build    # production build
npm run lint     # eslint
```

Copy `.env.example` to `.env` and fill in the values before running.

---

## 🚀 Live Preview
Explore the platform live here: **[https://lcwkr.vercel.app/](https://lcwkr.vercel.app/)**

---

### 👨‍💻 Developed by **Kazi Robin**
* **GitHub:** [@lcwkr](https://github.com/lcwkr)
* **Project Name:** lcwkr (Learn Chinese with Kazi Robin)
* 
