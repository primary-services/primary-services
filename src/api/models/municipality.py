from enum import Enum
from sqlalchemy.orm import Mapped, mapped_column
from models.base import BaseModel

class MunicipalityType(str, Enum):
    STATE = "state"
    COUNTY = "county"
    TOWN = "town"
    DISTRICT = "district"

class Municipality(BaseModel):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    type: Mapped[MunicipalityType]
    
