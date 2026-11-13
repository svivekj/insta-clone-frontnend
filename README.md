# 📱 Instagram Clone - React Frontend

A modern, responsive single-page web application built with **React 19**, **Vite**, and **Tailwind CSS v4**. It interfaces directly with the Spring Boot backend REST API to render live feeds, post creation forms, interactive heart likes, and real-time comment threads.

---

## 🚀 Tech Stack & Requirements

- **React 19**
- **Vite** (Next-gen frontend build tool)
- **Tailwind CSS v4** (Utility-first CSS styling)
- **Lucide React** (Modern SVG icon library)
- **Axios** (HTTP client for API requests)
- **Node.js** (v18+ recommended)

---

## 🌐 Infrastructure & Ports

- **Frontend Development Server Port:** `5173` (`http://localhost:5173`)
- **Backend API Base URL:** `http://localhost:9090/api`

---

## 🛠️ Step-by-Step Setup & Running Instructions

### Step 1: Install Dependencies

Navigate into your frontend project directory and install the required npm packages:

```bash
cd insta-clone-frontend
npm install
```

### Step 2: Configure API Client

Ensure your Axios client configuration (`src/api/axios.js`) points to your Spring Boot backend:

```javascript
import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:9090/api",
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Step 3: Run the Development Server

Start the Vite local development server:

```bash
npm run dev
```

- Open your browser and navigate to **`http://localhost:5173`**.
- _Make sure your Spring Boot backend is running concurrently on port `9090`._

---

## ✨ Core Features Implemented

- **Live Feed Dashboard:** Dynamically fetches and renders posts with author tags, image previews, captions, and real-time like/comment counters.
- **Interactive Liking:** Clickable heart toggle button that communicates with the backend database to instantly update likes.
- **Post Creator Form:** Form interface allowing users to share new posts instantly by providing an image URL and caption.
- **Expandable Comment Sections:** Accordion-style comment drawers per post to view historical comments and submit new ones instantly.
