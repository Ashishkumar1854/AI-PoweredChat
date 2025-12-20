#backend/main.py
from fastapi import FastAPI
from routes.chat import router as chat_router

app = FastAPI(title="AI Chatbot Backend")

@app.get("/")
def root():
    return {"status": "Backend running"}

app.include_router(chat_router)
