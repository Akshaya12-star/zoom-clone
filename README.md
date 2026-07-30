# Zoom Clone

A video calling web app built with React, Vite, and Firebase — create a call, share a room ID, and join from another device or browser tab.

🔗 Live Demo: https://zoom-clone-red-chi.vercel.app/

# Features
🎥 Create a new video call room
🔑 Join an existing call using a Room ID
🔥 Real-time signaling powered by Firebase
⚡ Fast dev/build experience with Vite
# Tech Stack
Frontend: React, Vite
Backend / Realtime: Firebase
Deployment: Vercel
Getting Started
Prerequisites
Node.js (v18 or higher recommended)
A Firebase project (for backend config)
Installation

# Clone the repo:

bash
git clone https://github.com/Akshaya12-star/zoom-clone
cd zoom-clone/zoom-clone

# Install dependencies:

bash
npm install
Running Locally
bash
npm run dev

The app will be available at http://localhost:5173 (or the port shown in your terminal).

Building for Production
bash
npm run build

This generates an optimized build in the dist/ folder.

# Deployment

This project is deployed on Vercel. When importing the repo into Vercel:

Root Directory: zoom-clone
Build Command: npm run build
Output Directory: dist

A vercel.json file is included to handle client-side routing (SPA rewrites).

## Project Structure

```
zoom-clone/
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── firebase.js
│   └── main.jsx
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

# Author
Akshaya S
