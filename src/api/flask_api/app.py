from models import (
    db, 
    BaseModel,
    Municipality,
    MunicipalityType, 
    Official, 
    Office,
    Term, 
    Election, 
    Deadline, 
    Form,
    Requirement,
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
    try: 
        serialized_towns = [town.to_dict(nested=True) for town in towns]
    except:
        print("Error Serializing Towns")
        return {"error:", "Error serializing town"}, 500

    return serialized_towns, 200

@app.get("/municipality/<municipality_id>/offices")
def get_municipality_offices(municipality_id):
    offices = db.session.execute(
        text("""
            SELECT 
                office.*,
                seats.agg AS seats
            FROM 
                office
            LEFT JOIN LATERAL (
                SELECT 
                    JSONB_AGG(seats_with_terms.*) AS agg
                FROM (
                    SELECT 
                        seat.*,
                        JSONB_AGG(term.*) AS terms
                    FROM 
                        seat
                    LEFT JOIN
                        term ON term.seat_id = seat.id
                    WHERE 
                        seat.office_id = office.id
                    GROUP BY
                        seat.id
                ) AS seats_with_terms
            ) AS seats ON TRUE
            WHERE municipality_id = :id
        """), {"id": int(municipality_id)}
    ).mappings().all()   

    return jsonify([dict(office) for office in offices]), 200


@app.get("/municipality/<municipality_id>/elections")
def get_municipality_elections(municipality_id):
    elections = db.session.execute(
        text("""
SELECT 
                election.*,
                requirements.agg AS requirements,
                deadlines.agg AS deadlines,
                forms.agg AS forms,
                JSON_BUILD_OBJECT( 
                    'ids', JSONB_AGG(seat.id),
                    'names', JSONB_AGG(seat.name),
                    'terms', JSONB_AGG(term.*)
                ) AS seats
            FROM 
                election
            LEFT JOIN 
                election_term ON election_term.election_id = election.id
            LEFT JOIN 
                term ON election_term.term_id = term.id
            LEFT JOIN
                seat ON term.seat_id = seat.id
            LEFT JOIN LATERAL (
                SELECT 
                    JSONB_AGG(rc.*) AS agg 
                FROM (
                    SELECT 
                        r.*,
                        TO_JSONB(d.*) AS deadline,
                        TO_JSONB(f.*) As form
                    FROM 
                        requirement AS r
                    LEFT JOIN 
                        deadline AS d ON d.id = r.deadline_id 
                    LEFT JOIN 
                        form AS f ON f.id = r.form_id
                ) AS rc
                LEFT JOIN 
                    requirement_parent 
                ON 
                    requirement_parent.requirement_id = rc.id  
                WHERE
                    requirement_parent.parent_id = election.id AND requirement_parent.parent_type = 'ELECTION'
            ) AS requirements ON TRUE
            LEFT JOIN LATERAL (
                SELECT 
                    JSONB_AGG(deadline.*) AS agg
                FROM    
                    deadline
                LEFT JOIN 
                    deadline_parent 
                ON 
                    deadline_parent.deadline_id = deadline.id  
                WHERE
                    deadline_parent.parent_id = election.id AND deadline_parent.parent_type = 'ELECTION'
            ) AS deadlines ON TRUE
            LEFT JOIN LATERAL (
                SELECT 
                    JSONB_AGG(form.*) AS agg
                FROM    
                    form
                LEFT JOIN 
                    form_parent 
                ON 
                    form_parent.form_id = form.id  
                WHERE
                    form_parent.parent_id = election.id AND form_parent.parent_type = 'ELECTION'
            ) AS forms ON TRUE
            WHERE 
                seat.office_id IN (
                    SELECT id FROM office WHERE municipality_id = :id
                )
            GROUP BY
                election.id,
                requirements.agg,
                deadlines.agg,
                forms.agg
        """), {"id": int(municipality_id)}
    ).mappings().all()   

    return jsonify([dict(election) for election in elections]), 200



@app.get("/municipality/<municipality_id>")
def get_municipality(municipality_id):
    municipality = db.session.execute(
        text("""
            SELECT 
                municipality.*,
                offices.agg AS offices,
                elections.agg AS elections
            FROM 
                municipality
            LEFT JOIN LATERAL (
                SELECT 
                    JSONB_AGG(offices_complete) AS agg
                FROM (
                    SELECT 
                        office.*,
                        seats.agg AS seats
                    FROM 
                        office
                    LEFT JOIN LATERAL (
                        SELECT 
                            JSONB_AGG(seats_with_terms.*) AS agg
                        FROM (
                            SELECT 
                                seat.*,
                                JSONB_AGG(term.*) AS terms
                            FROM 
                                seat
                            LEFT JOIN
                                term ON term.seat_id = seat.id
                            WHERE 
                                seat.office_id = office.id
                            GROUP BY
                                seat.id
                        ) AS seats_with_terms
                    ) AS seats ON TRUE
                    WHERE municipality_id = municipality.id
                ) AS offices_complete
            ) AS offices ON TRUE
            LEFT JOIN LATERAL (
                SELECT 
                    JSONB_AGG(elections_complete) AS agg
                FROM (
                    SELECT 
                        election.*,
                        requirements.agg AS requirements
                    FROM 
                        election
                    LEFT JOIN 
                        election_term ON election_term.election_id = election.id
                    LEFT JOIN 
                        term ON election_term.term_id = term.id
                    LEFT JOIN
                        seat ON term.seat_id = seat.id
                    LEFT JOIN LATERAL (
                        SELECT 
                            JSONB_AGG(rc.*) AS agg 
                        FROM (
                            SELECT 
                                r.*,
                                TO_JSONB(d.*) AS deadline,
                                TO_JSONB(f.*) As form
                            FROM 
                                requirement AS r
                            LEFT JOIN 
                                deadline AS d ON d.id = r.deadline_id 
                            LEFT JOIN 
                                form AS f ON f.id = r.form_id
                        ) AS rc
                        LEFT JOIN 
                            requirement_parent 
                        ON 
                            requirement_parent.requirement_id = rc.id  
                        WHERE
                            requirement_parent.parent_id = election.id AND requirement_parent.parent_type = 'ELECTION'
                    ) AS requirements ON TRUE
                    LEFT JOIN LATERAL (
                        SELECT 
                            JSONB_AGG(deadline.*) AS agg
                        FROM    
                            deadline
                        LEFT JOIN 
                            deadline_parent 
                        ON 
                            deadline_parent.deadline_id = deadline.id  
                        WHERE
                            deadline_parent.parent_id = election.id AND deadline_parent.parent_type = 'ELECTION'
                    ) AS deadlines ON TRUE
                    LEFT JOIN LATERAL (
                        SELECT 
                            JSONB_AGG(form.*) AS agg
                        FROM    
                            form
                        LEFT JOIN 
                            form_parent 
                        ON 
                            form_parent.form_id = form.id  
                        WHERE
                            form_parent.parent_id = election.id AND form_parent.parent_type = 'ELECTION'
                    ) AS forms ON TRUE
                    WHERE 
                        seat.office_id IN (
                            SELECT id FROM office WHERE municipality_id = municipality.id
                        )
                ) AS elections_complete
            ) AS elections ON TRUE
            WHERE municipality.id = :id
        """), {"id": int(municipality_id)}
    ).mappings().first()   

    return jsonify(dict(municipality)), 200

@app.post("/municipality/<municipality_id>/office")
def create_municiple_office(municipality_id):
    data = request.json
    
    office = BaseModel.parse(Office, data)
    office.municipality_id = municipality_id

    db.session.add(office)
    db.session.commit()  

    return {"success": True}, 200

    # _terms = _office["terms"]

    # office = Office.upsert(Office, _office)[0]
    # office_fks = {
    #     "office_id": office.id,
    #     "municipality_id": office.municipality_id
    # }

@app.get("/town/<town_id>")
def get_town(town_id):
    town = Municipality.where(id=int(town_id)).first()
    return town.to_dict(nested=True), 200

@app.get("/town/<town_id>/offices")
def get_town_offices(town_id):
    offices = Office.where(municipality_id=int(town_id)).all()
    
    serialized = [office.to_dict(nested=True, hybrid_attributes=True) for office in offices]
    return serialized, 200

@app.get("/town/<town_id>/requirements")
def get_town_requirements(town_id):
    rs = Requirement.where(municipality_id=int(town_id)).all()
    serialized = [r.to_dict(nested=True) for r in rs]
    return serialized, 200

@app.get("/office/<office_id>")
def get_office(office_id):
    office = Office.where(id=int(office_id)).first()
    return office.to_dict(nested=True, hybrid_attributes=True), 200

@app.get("/office/<office_id>/terms")
def get_office_terms(office_id):
    terms = Term.where(election___office_id=int(office_id)).all()
    serialized = [t.to_dict(nested=True) for t in terms]
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