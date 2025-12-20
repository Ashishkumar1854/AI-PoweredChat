# # backend/services/task_service.py

# from services.supabase_service import get_tasks_by_company

# def filter_tasks_by_status(company_id: str, status: str):
#     tasks = get_tasks_by_company(company_id)
#     return [t for t in tasks if t["status"] == status]


#//////////////newwwww
# from services.supabase_service import get_tasks_by_company

# def filter_tasks_by_status(company_id: str, status: str | None = None):
#     tasks = get_tasks_by_company(company_id)

#     if status:
#         tasks = [t for t in tasks if t["status"] == status]

#     return tasks



from services.supabase_service import get_tasks_by_company

def filter_tasks_by_status(company_id: str, status: str | None = None):
    tasks = get_tasks_by_company(company_id)

    if status:
        tasks = [t for t in tasks if t["status"] == status]

    return tasks
