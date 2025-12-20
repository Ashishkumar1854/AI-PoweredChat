#backend/routes/chat.py
# from fastapi import APIRouter, Header, HTTPException
# from services.supabase_service import get_user_company, get_tasks
# from supabase import create_client
# from config import SUPABASE_URL, SUPABASE_ANON_KEY

# router = APIRouter()

# supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)


# @router.post("/chat")
# async def chat(question: dict, authorization: str = Header(None)):
#     if not authorization:
#         raise HTTPException(status_code=401, detail="Unauthorized")

#     token = authorization.replace("Bearer ", "")

#     # 🔐 Validate user
#     user_res = supabase.auth.get_user(token)
#     user = user_res.user

#     if not user:
#         raise HTTPException(status_code=401, detail="Invalid token")

#     # 🏢 Get company
#     user_row = get_user_company(user.id)
#     if not user_row:
#         return {"answer": "No company assigned to your account."}

#     company_id = user_row["company_id"]

#     # 📋 Fetch tasks
#     tasks = get_tasks(company_id)

#     return {
#         "answer": f"You have {len(tasks)} tasks in your company.",
#         "tasks": tasks
#     }



from fastapi import APIRouter
from services.supabase_service import get_tasks

router = APIRouter(prefix="/chat")

@router.post("/")
def chat(payload: dict):
    question = payload.get("question", "").lower()

    # temporary logic (LLM later)
    if "pending" in question:
        return {"answer": "Pending tasks logic will be here"}

    return {"answer": "I understood your question"}
