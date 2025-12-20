# #backend/services/supabase_service.pyfrom supabase import create_client
# from supabase import create_client, Client
# from config import SUPABASE_URL, SUPABASE_ANON_KEY

# supabase: Client = create_client(
#     SUPABASE_URL,
#     SUPABASE_ANON_KEY
# )

# def get_user_company(user_id: str):
#     res = (
#         supabase
#         .table("users")
#         .select("company_id")
#         .eq("id", user_id)
#         .single()
#         .execute()
#     )
#     return res.data

# def get_tasks(company_id: str):
#     res = (
#         supabase
#         .table("tasks")
#         .select("*")
#         .eq("company_id", company_id)
#         .execute()
#     )
#     return res.data

#//////////////////////////NEWWWWWW
# from supabase import create_client, Client
# from config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

# supabase: Client = create_client(
#     SUPABASE_URL,
#     SUPABASE_SERVICE_ROLE_KEY
# )

# def get_user_company(user_id: str):
#     # 1️⃣ Get user from Supabase Auth
#     auth_user = supabase.auth.admin.get_user_by_id(user_id)

#     if not auth_user or not auth_user.user:
#         return None

#     user_email = auth_user.user.email

#     # 2️⃣ Map email → company_id
#     res = (
#         supabase
#         .table("users")
#         .select("company_id")
#         .eq("email", user_email)
#         .single()
#         .execute()
#     )

#     return res.data


# def get_tasks_by_company(company_id: str):
#     res = (
#         supabase
#         .table("tasks")
#         .select("id, title, status, created_at")
#         .eq("company_id", company_id)
#         .execute()
#     )

#     return res.data or []


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
