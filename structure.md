multi-company-chatbot/
│
├── frontend/ # React (Vite)
│ ├── .env
│ ├── index.html
│ ├── package.json
│ └── src/
│ ├── main.jsx
│ ├── App.jsx
│ │
│ ├── services/
│ │ └── supabase.js # 🔥 Supabase client (IMPORTANT)
│ │
│ ├── auth/
│ │ ├── useAuth.js
│ │ └── ProtectedRoute.jsx
│ │
│ ├── pages/
│ │ ├── Login.jsx
│ │ ├── Dashboard.jsx
│ │ └── Tasks.jsx
│ │
│ └── components/
│ └── Navbar.jsx
│
├── backend/ # Node + Express (later)
│ ├── .env
│ ├── server.js
│ └── routes/
│
├── ai/ # AI / LLM (later)
│ ├── agent.js
│ └── prompts/
│
└── README.md
