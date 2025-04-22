import datetime

# from enum import Enum
from enum import Enum

from typing import Optional, List, get_args
from sqlalchemy import inspect, engine, literal_column, UniqueConstraint
from sqlalchemy.dialects.postgresql import insert, ENUM
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
    offices: Mapped[List["Office"]] = relationship(back_populates="municipality")

    name: Mapped[str]
    website: Mapped[str] = mapped_column(nullable=True)
    type: Mapped[MunicipalityType] = mapped_column(ENUM(
    	MunicipalityType, 
    	name='municipalitytype', 
    ))

    requirements: Mapped[List["Requirement"]] = relationship(
    	secondary='requirement_parent',
    	primaryjoin="and_(RequirementParent.parent_type=='municipality',foreign(RequirementParent.parent_id)==Municipality.id)",
    	secondaryjoin="foreign(Requirement.id)==RequirementParent.requirement_id",
    )

    deadlines: Mapped[List["Deadline"]] = relationship(
    	secondary='deadline_parent',
    	primaryjoin="and_(DeadlineParent.parent_type=='municipality',foreign(DeadlineParent.parent_id)==Municipality.id)",
    	secondaryjoin="foreign(Deadline.id)==DeadlineParent.deadline_id",
    )

    forms: Mapped[List["Form"]] = relationship(
    	secondary='form_parent',
    	primaryjoin="and_(FormParent.parent_type=='municipality',foreign(FormParent.parent_id)==Municipality.id)",
    	secondaryjoin="foreign(Form.id)==FormParent.form_id",
    )
    
    __mapper_args__ = {
        "polymorphic_identity": "municipality",
    }

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
	id: Mapped[int] = mapped_column(primary_key=True, default=lambda c: "default")

	municipality_id: Mapped[int] = mapped_column(ForeignKey('municipality.id'))
	municipality: Mapped[Municipality] = relationship(back_populates="offices")

	officials: Mapped[List["Official"]] = relationship(back_populates="office")

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
	
	election_id: Mapped[int] = mapped_column(ForeignKey('election.id'))
	election: Mapped["Election"] = relationship()


# terms
# 	- id,
# 	- start,
# 	- end,
# 	- incumbents: [],
class Term(BaseModel):
	id: Mapped[int] = mapped_column(primary_key=True)
	election: Mapped["Election"] = relationship(back_populates="term")
	start: Mapped[datetime.date]
	end: Mapped[datetime.date]
	incumbents: Mapped[List[Official]] = relationship(back_populates="term")


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

	office_id: Mapped[Optional[int]] = mapped_column(ForeignKey('office.id'))
	office: Mapped[Office] = relationship()

	type: Mapped[ElectionType] = mapped_column(ENUM(
		ElectionType, 
		name='electiontype'
	))
	polling_date: Mapped[datetime.date]
	seat_count: Mapped[int]

	requirements: Mapped[List["Requirement"]] = relationship(
    	secondary='requirement_parent',
    	primaryjoin="and_(RequirementParent.parent_type=='election',foreign(RequirementParent.parent_id)==Election.id)",
    	secondaryjoin="foreign(Requirement.id)==RequirementParent.requirement_id",
    )

	deadlines: Mapped[List["Deadline"]] = relationship(
    	secondary='deadline_parent',
    	primaryjoin="and_(DeadlineParent.parent_type=='election',foreign(DeadlineParent.parent_id)==Election.id)",
    	secondaryjoin="foreign(Deadline.id)==DeadlineParent.deadline_id",
	)

	forms: Mapped[List["Form"]] = relationship(
    	secondary='form_parent',
    	primaryjoin="and_(FormParent.parent_type=='election',foreign(FormParent.parent_id)==Election.id)",
    	secondaryjoin="foreign(Form.id)==FormParent.form_id",
	)

	__mapper_args__ = {
        "polymorphic_identity": "election",
    }
	
	
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

	deadline_id: Mapped[int] = mapped_column(ForeignKey('deadline.id'))
	deadline: Mapped["Deadline"] = relationship()

	scopes: Mapped[List["RequirementScope"]] = relationship()
	
	label: Mapped[str]
	description: Mapped[str]

# forms 
# 	- id
# 	- title
# 	- description
# 	- url

class Form(BaseModel):
	id: Mapped[int] = mapped_column(primary_key=True)

	label: Mapped[str]
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

	label: Mapped[str]
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


class RequirementTypes(str, Enum):
    MUNICIPALITY = "municipality"
    ELECTION = "election"
    
class RequirementParent(BaseModel):
	id: Mapped[int] = mapped_column(primary_key=True)
	requirement_id: Mapped[int] = mapped_column(ForeignKey('requirement.id'))
	parent_id: Mapped[int] = mapped_column(nullable=False)
	parent_type: Mapped[RequirementTypes] = mapped_column(ENUM(
		RequirementTypes, 
		name='requirementtype'
	))

	__mapper_args__ = {
        "polymorphic_identity": "requirement",
        "polymorphic_on": "parent_type",
    }

class DeadlineTypes(str, Enum):
    MUNICIPALITY = "municipality"
    ELECTION = "election"
    
class DeadlineParent(BaseModel):
	id: Mapped[int] = mapped_column(primary_key=True)
	deadline_id: Mapped[int] = mapped_column(ForeignKey("deadline.id"))
	parent_id: Mapped[int] = mapped_column(nullable=False)
	parent_type: Mapped[DeadlineTypes] = mapped_column(ENUM(
		DeadlineTypes, 
		name='deadlinetype'
	))

	__mapper_args__ = {
        "polymorphic_identity": "deadline",
        "polymorphic_on": "parent_type",
    }

class FormTypes(str, Enum):
    MUNICIPALITY = "municipality"
    ELECTION = "election"
    
class FormParent(BaseModel):
	id: Mapped[int] = mapped_column(primary_key=True)
	form_id: Mapped[int] = mapped_column(ForeignKey("form.id"))
	parent_id: Mapped[int] = mapped_column(nullable=False)
	parent_type: Mapped[FormTypes] = mapped_column(ENUM(
		FormTypes, 
		name='formtype'
	))

	__mapper_args__ = {
        "polymorphic_identity": "form",
        "polymorphic_on": "parent_type",
    }

# class ElectionRequirement(BaseModel):
# 	election_id: Mapped[int] = mapped_column(ForeignKey("election.id"), primary_key=True)
# 	requirement_id: Mapped[int] = mapped_column(ForeignKey("requirement.id"), primary_key=True)
	
# 	__table_args__ = (
# 		UniqueConstraint("election_id", "requirement_id", name="election_requirement_idx"),
# 	)

# class ElectionDeadline(BaseModel):
# 	election_id: Mapped[int] = mapped_column(ForeignKey("election.id"), primary_key=True)
# 	deadline_id: Mapped[int] = mapped_column(ForeignKey("deadline.id"), primary_key=True)
	
# 	__table_args__ = (
# 		UniqueConstraint("election_id", "deadline_id", name="election_deadline_idx"),
# 	)

# class ElectionForm(BaseModel):
# 	election_id: Mapped[int] = mapped_column(ForeignKey("election.id"), primary_key=True)
# 	form_id: Mapped[int] = mapped_column(ForeignKey("form.id"), primary_key=True)
	
# 	__table_args__ = (
# 		UniqueConstraint("election_id", "form_id", name="election_form_idx"),
# 	)
