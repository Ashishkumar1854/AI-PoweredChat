# # backend/services/task_service.py



from datetime import datetime, timedelta, timezone
from services.supabase_service import get_tasks_by_company

# STATUS BASED 

def normalize_status(value: str | None):
    if not value:
        return None
    return value.strip().lower()

def filter_tasks_by_status(company_id: str, status: str | None = None):
    tasks = get_tasks_by_company(company_id)

    if status:
        status = normalize_status(status)
        filtered = []

        for t in tasks:
            task_status = normalize_status(t.get("status"))

            if status == "in_progress":
                if task_status == "in_progress":
                    filtered.append(t)
            else:
                if task_status == status:
                    filtered.append(t)

        return filtered

    return tasks


#  DATE BASED 

def filter_tasks_by_date(company_id: str, when: str):
    tasks = get_tasks_by_company(company_id)
    now = datetime.now(timezone.utc)

    if when == "today":
        start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end = start + timedelta(days=1)

    elif when == "yesterday":
        end = now.replace(hour=0, minute=0, second=0, microsecond=0)
        start = end - timedelta(days=1)

    else:
        return []

    result = []
    for t in tasks:
        created_at = datetime.fromisoformat(
            t["created_at"].replace("Z", "+00:00")
        )
        if start <= created_at < end:
            result.append(t)

    return result
