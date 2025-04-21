from models import (
    db, 
    Municipality,
    MunicipalityType, 
    Official, 
    Office,
    Term, 
    Election, 
    Deadline, 
    ElectionDeadline,
    Form,
    ElectionForm,
    Requirement,
    ElectionRequirement
)
from flask import Flask, jsonify, request
from flask_cors import CORS
from creds import CredentialsManager
from dataclasses import asdict

from sqlalchemy import select
from sqlalchemy.sql import text


# create the app
app = Flask(__name__)
CORS(app)

# configure the SQLite database, relative to the app instance folder
app.config["SQLALCHEMY_DATABASE_URI"] = CredentialsManager().get_db_url()
# initialize the app with the extension
db.init_app(app)

with app.app_context():
    db.create_all()
    
@app.get("/towns")
def get_towns():
    towns = Municipality.query.all()   
    serialized = [town.to_dict(nested=True) for town in towns]
    return serialized, 200

@app.get("/town/<town_id>")
def get_town(town_id):
    town = Municipality.where(id=int(town_id)).first()
    return town.to_dict(nested=True), 200

@app.get("/town/<town_id>/offices")
def get_town_offices(town_id):
    offices = Office.where(municipality_id=int(town_id)).all()
    serialized = [office.to_dict(nested=True) for office in offices]
    return serialized, 200

@app.get("/town/<town_id>/requirements")
def get_town_requirements(town_id):
    rs = Requirement.where(municipality_id=int(town_id)).all()
    serialized = [r.to_dict(nested=True) for r in rs]
    return serialized, 200

@app.post("/office")
def create_office():
    _office = request.json
    _terms = _office["terms"]

    office = Office.upsert(Office, _office)[0]
    office_fks = {
        "office_id": office.id,
        "municipality_id": office.municipality_id
    }

    for _term in _terms:
        _election = _term["election"]
    
        term = Term.upsert(Term, {**office_fks,**_term})[0]
        term_fks = {
            "term_id": term.id
        }

        election = Election.upsert(Election, {**office_fks, **term_fks, **_election})[0]
        election_fks = {
            "election_id": election.id
        }

        for _deadline in _election["deadlines"]:
            deadline = Deadline.upsert(Deadline, {**office_fks, **_deadline})[0]
            rel = Deadline.upsert_m2m(ElectionDeadline, "election_deadline_idx", {
                "election_id": election.id,
                "deadline_id": deadline.id
            })

        for _form in _election["forms"]:
            form = Form.upsert(Form, {**office_fks, **_form})[0]
            rel = Form.upsert_m2m(ElectionForm, "election_form_idx", {
                "election_id": election.id,
                "form_id": form.id
            })


        for _requirement in _election["requirements"]:
            form = None
            deadline = None
            req_fks = {}

            if "form" in _requirement and _requirement["form"] != None:
                form = Form.upsert(Form, {**office_fks, **_requirement["form"]})[0]
                req_fks["form_id"] = form.id 
                rel = Form.upsert_m2m(ElectionForm, "election_form_idx", {
                    "election_id": election.id,
                    "form_id": form.id
                })
                
            if "deadline" in _requirement and _requirement["deadline"] != None:
                deadline = Deadline.upsert(Deadline, {**office_fks, **_requirement["deadline"]})[0]
                req_fks["deadline_id"] = deadline.id
                rel = Form.upsert_m2m(ElectionDeadline, "election_deadline_idx", {
                    "election_id": election.id,
                    "deadline_id": deadline.id
                }) 

            requirement = Requirement.upsert(Requirement, {**office_fks, **req_fks, **_requirement})[0]
            rel = Requirement.upsert_m2m(ElectionRequirement, "election_requirement_idx", {
                "election_id": election.id,
                "requirement_id": requirement.id
            }) 

    db.session.commit()

    # TODO: Get and return the fully saved office
    
    print(office)

    return jsonify(office.to_dict())

@app.post("/requirement")
def create_requirement():
    _requirement = request.json
    requirement_fks = {
        "requirement_id": _requirement["id"],
        "municipality_id": _requirement["municipality_id"]
    }

    form = None
    deadline = None
    req_fks = {}

    if "form" in _requirement and _requirement["form"] != None:
        form = Form.upsert(Form, {**requirement_fks, **_requirement["form"]})[0]
        req_fks["form_id"] = form.id 
        
    if "deadline" in _requirement and _requirement["deadline"] != None:
        deadline = Deadline.upsert(Deadline, {**requirement_fks, **_requirement["deadline"]})[0]
        req_fks["deadline_id"] = deadline.id

    requirement = Requirement.upsert(Requirement, {**requirement_fks, **req_fks, **_requirement})[0]

    db.session.commit()    

    return jsonify(requirement.to_dict())

# Commenting this out, so we don't accidently create more towns
@app.post("/town")
def create_town():
    # town = request.json

    # created = Municipality.create(
    #     name=town["name"],
    #     type=town["type"],
    #     website=town["website"]
    # )

    # if (town["clerk"] != None and town["clerk"].get("name", None) != None):
    #     clerk_office = Office.create(
    #         municipality_id=created.id,
    #         title="Clerk",
    #         description="Current Town Clerk",
    #         elected=False,
    #     )

    #     clerk = Official.create(
    #         municipality_id=created.id,
    #         office_id=clerk_office.id,
    #         name=town["clerk"].get("name", ""),
    #         phone=town["clerk"].get("phone", ""),
    #         email=town["clerk"].get("email", ""),
    #         contact_form=town["clerk"].get("contact_form", "")
    #     )

    # if (town["assistant_clerk"] != None and town["assistant_clerk"].get("name", None) != None):
    #     assistant_clerk_office = Office.create(
    #         municipality_id=created.id,
    #         title="Assistant Clerk",
    #         description="Current Assistant Town Clerk",
    #         elected=False,
    #     )

    #     assistant = Official.create(
    #         municipality_id=created.id,
    #         office_id=assistant_clerk_office.id,
    #         name=town["assistant_clerk"].get("name", ""),
    #         phone=town["assistant_clerk"].get("phone", ""),
    #         email=town["assistant_clerk"].get("email", ""),
    #         contact_form=town["assistant_clerk"].get("contact_form", "")
    #     )

    return jsonify({"success": True})

@app.route('/')
def index():
    return 'Hello world!', 200