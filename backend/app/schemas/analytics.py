from typing import Dict, List, Any
from pydantic import BaseModel

class DashboardStats(BaseModel):
    total: int
    pending: int
    in_progress: int
    completed: int
    assigned: int
    categoryCounts: Dict[str, int]
    areaCounts: Dict[str, int]
    avgResolutionTimeHours: float

class CategoryStat(BaseModel):
    name: str
    count: int
    percentage: float

class WardStat(BaseModel):
    name: str
    total: int
    active: int
    pending: int
    resolved: int
