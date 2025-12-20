# backend/intents/intent_types.py

from enum import Enum

class IntentType(str, Enum):
    TASK_STATUS = "task_status"
    TASK_DATE = "task_date"
    TASK_ID = "task_id"
    EXCEL_HELP = "excel_help"
    TROUBLESHOOT = "troubleshoot"
    GENERAL = "general"
