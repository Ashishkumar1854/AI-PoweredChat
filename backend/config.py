# #backend/config.py
# import os
# from dotenv import load_dotenv

# load_dotenv()  # MUST be at top

# SUPABASE_URL = os.getenv("SUPABASE_URL")
# SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

# if not SUPABASE_URL or not SUPABASE_ANON_KEY:
#     raise RuntimeError("Supabase env vars not loaded")



#NNNNEWWWWWW
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("Supabase env vars missing")
