import datetime

# from enum import Enum
from enum import Enum
from typing import Optional, List, get_args
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.schema import ForeignKey
from models.base import BaseModel

class MunicipalityType(str, Enum):
    STATE = "state"
    COUNTY = "county"
    TOWN = "town"
    DISTRICT = "district"

# municipalities
# 	- id
# 	- name
# 	- type (town/city/county/state)

class Municipality(BaseModel):
    id: Mapped[int] = mapped_column(primary_key=True)
    parent_id: Mapped[Optional[int]] = mapped_column(ForeignKey('municipality.id'))
    parent: Mapped["Municipality"] = relationship(remote_side=[id])
    requirements: Mapped[List["Requirement"]] = relationship(back_populates="municipality")
    forms: Mapped[List["Form"]] = relationship(back_populates="municipality")
    deadlines: Mapped[List["Deadline"]] = relationship(back_populates="municipality")
    offices: Mapped[List["Office"]] = relationship(back_populates="municipality")
    officials: Mapped[List["Official"]] = relationship(back_populates="municipality")
    name: Mapped[str]
    website: Mapped[str] = mapped_column(nullable=True)
    type: Mapped[MunicipalityType] = mapped_column(ENUM(
    	MunicipalityType, 
    	name='municipalitytype', 
    ))

# office_templates
# 	- id
# 	- title
# 	- description

class OfficeTemplate(BaseModel):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    description: Mapped[str]
    

# offices
# 	- id
# 	- municipality_id (FK)
# 	- title
# 	- description
# 	- elected (Something we want to track, like clerks may not be elected)
# 	- tenure (in months? days?)
# 	- salary
# 	- min_hours
# 	- max_hours

class Office(BaseModel):
	id: Mapped[int] = mapped_column(primary_key=True)
	municipality_id: Mapped[int] = mapped_column(ForeignKey('municipality.id'))
	municipality: Mapped[Municipality] = relationship(back_populates="offices")
	title: Mapped[str] = mapped_column(nullable=True)
	description: Mapped[str] = mapped_column(nullable=True)
	elected: Mapped[bool] = mapped_column(server_default='TRUE')
	tenure: Mapped[int] = mapped_column(nullable=True)
	salary: Mapped[int] = mapped_column(nullable=True)
	min_hours: Mapped[int] = mapped_column(nullable=True)
	max_hours: Mapped[int] = mapped_column(nullable=True)



# officials
# 	- id
# 	- municipality_id (FK)
# 	- office_id (FK)
# 	- term_id (FK)
# 	- name

class Official(BaseModel):
	id: Mapped[int] = mapped_column(primary_key=True)
	municipality_id: Mapped[int] = mapped_column(ForeignKey('municipality.id'), nullable=True)
	municipality: Mapped[Municipality] = relationship(back_populates="officials")
	office_id: Mapped[Optional[int]] = mapped_column(ForeignKey('office.id'), nullable=True)
	office: Mapped[Office] = relationship()
	term_id: Mapped[int] = mapped_column(ForeignKey('term.id'), nullable=True)
	term: Mapped["Term"] = relationship()
	name: Mapped[str] = mapped_column(nullable=True)
	phone: Mapped[str] = mapped_column(nullable=True)
	email: Mapped[str] = mapped_column(nullable=True)
	contact_form: Mapped[str] = mapped_column(nullable=True)

	
# candidates
# 	- id 
# 	- municipality_id (FK)
# 	- election_id (FK)

class Candidate(BaseModel):
	id: Mapped[int] = mapped_column(primary_key=True)
	name: Mapped[str]
	municipality_id: Mapped[int] = mapped_column(ForeignKey('municipality.id'))
	municipality: Mapped[Municipality] = relationship()
	election_id: Mapped[int] = mapped_column(ForeignKey('election.id'))
	election: Mapped["Election"] = relationship()


# terms
# 	- id,
# 	- start,
# 	- end,
# 	- incumbents: [],

class Term(BaseModel):
	id: Mapped[int] = mapped_column(primary_key=True)
	election: Mapped["Election"] = relationship()
	start: Mapped[datetime.date]
	end: Mapped[datetime.date]
	incumbents: Mapped[List[Official]] = relationship()


# elections
# 	- id
# 	- municipality_id (FK)
# 	- office_id (FK)
# 	- term_id (FK)
# 	- type (primary/general/special)
# 	- election_date

class ElectionType(str, Enum):
    PRIMARY = "primary"
    GENERAL = "general"
    SPECIAL = "special"

class Election(BaseModel):
	id: Mapped[int] = mapped_column(primary_key=True)
	term_id: Mapped[int] = mapped_column(ForeignKey("term.id"))
	term: Mapped[Term] = relationship()
	municipality_id: Mapped[int] = mapped_column(ForeignKey('municipality.id'))
	municipality: Mapped[Municipality] = relationship()
	office_id: Mapped[Optional[int]] = mapped_column(ForeignKey('office.id'))
	office: Mapped[Office] = relationship()
	# term_id: Mapped[int] = mapped_column(ForeignKey('term.id'))
	# term: Mapped[Term] = relationship()
	type: Mapped[ElectionType] = mapped_column(ENUM(
		ElectionType, 
		name='electiontype'
	))
	election_date: Mapped[datetime.date]
	
	
# requirements
# 	- id 
# 	- form_id (FK)
# 	- deadline_id (FK)
# 	- title
# 	- description
# 	- deadline

class Requirement(BaseModel):
	id: Mapped[int] = mapped_column(primary_key=True)
	municipality_id: Mapped[int] = mapped_column(ForeignKey('municipality.id'))
	municipality: Mapped[Municipality] = relationship()
	form_id: Mapped[int] = mapped_column(ForeignKey('form.id'))
	form: Mapped["Form"] = relationship()
	scopes: Mapped[List["RequirementScope"]] = relationship()
	deadline_id: Mapped[int] = mapped_column(ForeignKey('deadline.id'))
	deadline: Mapped["Deadline"] = relationship()
	title: Mapped[str]
	description: Mapped[str]

# forms 
# 	- id
# 	- title
# 	- description
# 	- url

class Form(BaseModel):
	id: Mapped[int] = mapped_column(primary_key=True)
	municipality_id: Mapped[int] = mapped_column(ForeignKey('municipality.id'))
	municipality: Mapped[Municipality] = relationship()
	title: Mapped[str]
	description: Mapped[str]
	url: Mapped[str]

# deadlines
# 	- id 
# 	- municipality_id (FK)
# 	- title
# 	- description
# 	- deadline

class Deadline(BaseModel):
	id: Mapped[int] = mapped_column(primary_key=True)
	municipality_id: Mapped[int] = mapped_column(ForeignKey('municipality.id'))
	municipality: Mapped[Municipality] = relationship()
	title: Mapped[str]
	description: Mapped[str]
	deadline: Mapped[datetime.date]


class RequirementScope(BaseModel):
	id: Mapped[int] = mapped_column(primary_key=True)
	requirement_id: Mapped[int] = mapped_column(ForeignKey('requirement.id'))
	mandatory: Mapped[bool]
	scope: Mapped[MunicipalityType] = mapped_column(ENUM(
    	MunicipalityType, 
    	name='municipalitytype', 
    	create_type=False
    ))

class ElectionRequirement(BaseModel):
	id: Mapped[int] = mapped_column(primary_key=True)
	election_id: Mapped[int] = mapped_column(ForeignKey("election.id"))
	requirement_id: Mapped[int] = mapped_column(ForeignKey("requirement.id"))

class ElectionDeadline(BaseModel):
	id: Mapped[int] = mapped_column(primary_key=True)
	election_id: Mapped[int] = mapped_column(ForeignKey("election.id"))
	deadline_id: Mapped[int] = mapped_column(ForeignKey("deadline.id"))

class ElectionForm(BaseModel):
	id: Mapped[int] = mapped_column(primary_key=True)
	election_id: Mapped[int] = mapped_column(ForeignKey("election.id"))
	form_id: Mapped[int] = mapped_column(ForeignKey("form.id"))
