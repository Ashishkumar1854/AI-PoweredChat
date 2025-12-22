AI-Powered Task Management Chatbot

This project is a task management dashboard with an AI chatbot.
Users can manage tasks and ask questions in natural language.

The chatbot understands:

Task status questions (pending / done / in progress)

Date based task questions (today / yesterday)

General IT & Excel questions

Troubleshooting issues

Tech Stack

Frontend

React + Vite

Supabase Auth

Backend

Python (FastAPI)

Supabase (Database + Auth)

Gemini AI (LLM)

Main Features
1. Task Management

Create tasks

Task status:

pending

in_progress

done

2. AI Chatbot (Backend Driven)

All chat queries go to Python backend, not directly to Supabase.

3. Task Queries (No AI Used)

These queries work even if AI is down:

show my pending tasks

show my done tasks

show my in progress tasks

show today tasks

show yesterday tasks

4. AI Based Queries (Gemini)

These use Gemini AI:

Excel questions
Example: what is excel vlookup

Troubleshooting
Example: email not working

General IT questions

Project Architecture (Simple)
Frontend (React)
        |
        |  (All chat requests)
        v
Backend (FastAPI)
        |
        ├── Task queries → Supabase DB (No AI)
        └── General queries → Gemini AI

Environment Variables (.env)

Create a .env file in backend folder:

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

LLM_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=models/gemini-1.5-flash

Backend Setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at:

http://localhost:5173
