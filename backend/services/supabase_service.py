# #backend/services/supabase_service.pyfrom supabase import 


from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
)

def get_user_company_by_email(email: str):
    res = (
        supabase
        .table("users")
        .select("company_id")
        .eq("email", email)
        .single()
        .execute()
    )
    return res.data

def get_tasks_by_company(company_id: str):
    res = (
        supabase
        .table("tasks")
        .select("id, title, status, created_at")
        .eq("company_id", company_id)
        .execute()
    )
    return res.data or []
