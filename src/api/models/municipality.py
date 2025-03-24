from enum import Enum
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from base import db

class MunicipalityType(Enum):
    STATE = "state"
    COUNTY = "county"
    TOWN = "town"
    DISTRICT = "district"

class Municipality(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    type: Mapped[Enum] = mapped_column()
    
