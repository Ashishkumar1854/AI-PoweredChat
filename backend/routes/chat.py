# #backend/routes/chat.py
# # from fastapi import APIRouter, Header, HTTPException
# # from services.supabase_service import get_user_company, get_tasks
# # from supabase import create_client
# # from config import SUPABASE_URL, SUPABASE_ANON_KEY

# # router = APIRouter()

# # supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)


# # @router.post("/chat")
# # async def chat(question: dict, authorization: str = Header(None)):
# #     if not authorization:
# #         raise HTTPException(status_code=401, detail="Unauthorized")

# #     token = authorization.replace("Bearer ", "")

# #     # 🔐 Validate user
# #     user_res = supabase.auth.get_user(token)
# #     user = user_res.user

# #     if not user:
# #         raise HTTPException(status_code=401, detail="Invalid token")

# #     # 🏢 Get company
# #     user_row = get_user_company(user.id)
# #     if not user_row:
# #         return {"answer": "No company assigned to your account."}

# #     company_id = user_row["company_id"]

# #     # 📋 Fetch tasks
# #     tasks = get_tasks(company_id)

# #     return {
# #         "answer": f"You have {len(tasks)} tasks in your company.",
# #         "tasks": tasks
# #     }



# # backend/routes/chat.py

# from fastapi import APIRouter
# from intents.intent_detector import detect_intent
# from intents.intent_types import IntentType
# from services.task_service import filter_tasks_by_status
# from services.supabase_service import get_user_company

# router = APIRouter()

# @router.post("/chat")
# def chat(payload: dict):
#     question = payload.get("question", "").strip()
#     user_id = payload.get("user_id")  # ✅ user_id only (secure)

#     if not question or not user_id:
#         return {"answer": "Invalid request. Missing question or user."}

#     # 🔐 STEP-1: user → company
#     user_company = get_user_company(user_id)
#     if not user_company:
#         return {"answer": "User is not mapped to any company."}

#     company_id = user_company["company_id"]

#     # 🧠 STEP-2: intent detection
#     intent = detect_intent(question.lower())

#     # 📌 TASK STATUS
#     if intent == IntentType.TASK_STATUS:
#         status = None
#         if "pending" in question:
#             status = "pending"
#         elif "done" in question or "completed" in question:
#             status = "done"
#         elif "progress" in question:
#             status = "in_progress"

#         tasks = filter_tasks_by_status(company_id, status)

#         if not tasks:
#             return {
#                 "answer": f"No {status or 'matching'} tasks found for your company."
#             }

#         task_list = "\n".join(
#             [f"- {t['title']} ({t['status']})" for t in tasks]
#         )

#         return {
#             "answer": (
#                 f"Here are your {status or 'current'} tasks:\n"
#                 f"{task_list}"
#             )
#         }

#     # 📊 EXCEL / 🛠 TROUBLESHOOT (LLM PHASE)
#     if intent in [IntentType.EXCEL_HELP, IntentType.TROUBLESHOOT]:
#         return {
#             "answer": "This will be handled by LLM in the next phase."
#         }

#     return {
#         "answer": "Sorry, I could not understand your request clearly."
#     }


from fastapi import APIRouter, Header, HTTPException
from supabase import create_client
from config import SUPABASE_URL, SUPABASE_ANON_KEY
from services.supabase_service import get_user_company_by_email
from services.task_service import filter_tasks_by_status
from intents.intent_detector import detect_intent
from intents.intent_types import IntentType

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
    question = payload.get("question", "")

    user_company = get_user_company_by_email(user.email)
    if not user_company:
        return {"answer": "You are not mapped to any company."}

    company_id = user_company["company_id"]
    intent = detect_intent(question)

    if intent == IntentType.TASK_STATUS:
        q = question.lower()
        status = None

        if "pending" in q:
            status = "pending"
        elif "done" in q or "completed" in q:
            status = "done"

        tasks = filter_tasks_by_status(company_id, status)

        if not tasks:
            return {"answer": f"No {status} tasks found for your company."}

        lines = [f"- {t['title']} ({t['status']})" for t in tasks]
        return {"answer": "\n".join(lines)}

    return {"answer": "Please ask about your company tasks."}
