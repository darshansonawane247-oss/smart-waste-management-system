import math
from typing import Tuple, Optional
from sqlalchemy.orm import Session
from app.models.dustbin import Dustbin

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees) using Haversine formula.
    Returns distance in METERS.
    """
    R = 6371000.0  # Radius of the earth in meters

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2)
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

    distance = R * c
    return round(distance, 1)

def find_nearest_dustbin(lat: float, lon: float, db: Session) -> Tuple[Optional[Dustbin], Optional[float]]:
    """
    Finds the nearest dustbin to the given coordinates.
    Returns (Dustbin, distance_in_meters).
    """
    dustbins = db.query(Dustbin).all()
    if not dustbins:
        return None, None

    nearest_bin = None
    min_distance = float('inf')

    for bin_obj in dustbins:
        dist = calculate_distance(lat, lon, bin_obj.latitude, bin_obj.longitude)
        if dist < min_distance:
            min_distance = dist
            nearest_bin = bin_obj

    return nearest_bin, round(min_distance, 1)
