AI-powered-chatbot/
│
├── frontend/ # React (already exists)
│ ├── src/
│ │ ├── components/
│ │ │ └── Chatbot.jsx # UPDATED → calls Python backend
│ │ ├── pages/
│ │ │ ├── Login.jsx
│ │ │ └── Dashboard.jsx
│ │ ├── services/
│ │ │ └── supabase.js
│ │ └── auth/
│ │ └── useAuth.js
│ └── .env
│
├── backend/ # 🆕 PYTHON BACKEND (NEW)
│ ├── main.py # FastAPI entry
│ ├── requirements.txt
│ ├── config.py # env, keys
│ │
│ ├── llm/
│ │ ├── llm_client.py # OpenAI / Ollama
│ │ └── prompts.py
│ │
│ ├── intents/
│ │ ├── intent_detector.py # task / date / excel / troubleshoot
│ │ └── intent_types.py
│ │
│ ├── services/
│ │ ├── supabase_service.py # fetch tasks
│ │ └── task_service.py
│ │
│ └── routes/
│ └── chat.py # /chat API
│
├── supabase/ # SAME (no change)
│ └── functions/
│ └── company-chat/ # ❌ WILL BE REMOVED
│
└── README.md
