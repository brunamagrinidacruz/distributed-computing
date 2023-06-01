import os
from dotenv import load_dotenv

load_dotenv()

REGIONS = {"AM", "EU"}
JWT_SECRET = os.getenv('JWT_SECRET')