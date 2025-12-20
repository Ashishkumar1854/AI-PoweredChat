#backend/services/supabase_service.pyfrom supabase import create_client
from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_ANON_KEY

supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
)

def get_user_company(user_id: str):
    res = (
        supabase
        .table("users")
        .select("company_id")
        .eq("id", user_id)
        .single()
        .execute()
    )
    return res.data

def get_tasks(company_id: str):
    res = (
        supabase
        .table("tasks")
        .select("*")
        .eq("company_id", company_id)
        .execute()
    )
    return res.data
