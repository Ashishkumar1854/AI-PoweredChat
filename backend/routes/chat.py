# #backend/routes/chat.py

from fastapi import APIRouter, Header, HTTPException
from supabase import create_client
from config import SUPABASE_URL, SUPABASE_ANON_KEY
from services.supabase_service import get_user_company_by_email
from services.task_service import (
    filter_tasks_by_status,
    filter_tasks_by_date
)
from intents.intent_detector import detect_intent
from intents.intent_types import IntentType
from llm.llm_client import ask_llm
from llm.prompts import GENERAL_PROMPT, TROUBLESHOOT_PROMPT

router = APIRouter()
supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

@router.post("/chat")
def chat(payload: dict, authorization: str = Header(None)):

    if not authorization:
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = authorization.replace("Bearer ", "")
    user_res = supabase.auth.get_user(token)
    if not user_res.user:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = user_res.user
    question = payload.get("question", "").strip().lower()

    user_company = get_user_company_by_email(user.email)
    if not user_company:
        return {"answer": "You are not mapped to any company."}

    company_id = user_company["company_id"]
    intent = detect_intent(question)

    # ================= TASK STATUS =================
    if intent == IntentType.TASK_STATUS:
        status = None

        if "pending" in question:
            status = "pending"
        elif "progress" in question:
            status = "in_progress"
        elif "done" in question or "completed" in question:
            status = "done"

        tasks = filter_tasks_by_status(company_id, status)

        if not tasks:
            return {"answer": f"No {status} tasks found."}

        task_lines = "\n".join(
            f"- {t['title']} ({t['status']})" for t in tasks
        )

        return {
            "answer": f"Here are your {status.replace('_',' ')} tasks:\n{task_lines}"
        }

    #  TASK DATE
    if intent == IntentType.TASK_DATE:
        when = "today" if "today" in question else "yesterday"

        tasks = filter_tasks_by_date(company_id, when)

        if not tasks:
            return {"answer": f"No tasks found for {when}."}

        task_lines = "\n".join(
            f"- {t['title']} ({t['status']})" for t in tasks
        )

        return {
            "answer": f"Here are your tasks for {when}:\n{task_lines}"
        }

    # ================= TROUBLESHOOT (NEW) =================
    if intent == IntentType.TROUBLESHOOT:
        try:
            return {"answer": ask_llm(TROUBLESHOOT_PROMPT, question)}
        except Exception:
            return {
                "answer": (
                    "I’m unable to access AI support right now.\n"
                    "Please try:\n"
                    "- Restart the application\n"
                    "- Check your internet connection\n"
                    "- Try logging out and logging in again"
                )
            }

    # ================= NON-TASK =================
    try:
        return {"answer": ask_llm(GENERAL_PROMPT, question)}
    except Exception:
        return {
            "answer": "AI service unavailable. Ask about tasks instead."
        }
