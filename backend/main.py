#backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chat import router as chat_router

app = FastAPI(title="AI Chatbot Backend")

# ✅ CORS CONFIG (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite frontend
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],   # POST, OPTIONS, etc.
    allow_headers=["*"],   # Authorization, Content-Type
)

@app.get("/")
def root():
    return {"status": "Backend running"}

# Chat routes
app.include_router(chat_router)
