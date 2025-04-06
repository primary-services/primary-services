from models import db, Municipality, MunicipalityType, Official, Office
from flask import Flask, jsonify, request
from flask_cors import CORS
from creds import CredentialsManager

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
    # Sorry, I can't figure out SQLAlchemy. It makes zero sense
    towns = db.session.execute(
        text("""
            SELECT 
               m.*, o.list AS officials 
            FROM 
                municipality AS m
            LEFT JOIN LATERAL (
                SELECT 
                    JSONB_AGG(off.*) AS list
                FROM (
                    SELECT 
                        official.*,
                        TO_JSONB(office.*) AS office
                    FROM 
                        official
                    LEFT JOIN
                        office ON office.id = official.office_id
                    WHERE 
                        official.municipality_id = m.id
                    
               ) AS off
            ) AS o ON TRUE
            WHERE m.type = 'TOWN'
        """)
    ).mappings().all()   

    return jsonify([dict(r) for r in towns]), 200
    # return jsonify([town[0].to_dict() for town in towns]), 200

@app.post("/town")
def create_town():
    town = request.json

    created = Municipality.create(
        name=town["name"],
        type=town["type"],
        website=town["website"]
    )

    if (town["clerk"] != None and town["clerk"].get("name", None) != None):
        clerk_office = Office.create(
            municipality_id=created.id,
            title="Clerk",
            description="Current Town Clerk",
            elected=False,
        )

        clerk = Official.create(
            municipality_id=created.id,
            office_id=clerk_office.id,
            name=town["clerk"].get("name", ""),
            phone=town["clerk"].get("phone", ""),
            email=town["clerk"].get("email", ""),
            contact_form=town["clerk"].get("contact_form", "")
        )

    if (town["assistant_clerk"] != None and town["assistant_clerk"].get("name", None) != None):
        assistant_clerk_office = Office.create(
            municipality_id=created.id,
            title="Assistant Clerk",
            description="Current Assistant Town Clerk",
            elected=False,
        )

        assistant = Official.create(
            municipality_id=created.id,
            office_id=assistant_clerk_office.id,
            name=town["assistant_clerk"].get("name", ""),
            phone=town["assistant_clerk"].get("phone", ""),
            email=town["assistant_clerk"].get("email", ""),
            contact_form=town["assistant_clerk"].get("contact_form", "")
        )

    return jsonify({"success": True})

@app.post("/office")
def create_office():
    office = request.json

    created = Office.create(
        municipality_id=office["municipality_id"],
        title=office["title"],
        description=office["description"],
        elected=True,
        salary=office["salary"],
        min_hours=office["commitment_min"],
        max_hours=office["commitment_max"]
    )

    return jsonify(created.to_dict())

@app.post("/term")
def create_term():
    term = request.json
    election = term["election"]

    created = Office.create(
        municipality_id=office["municipality_id"],
        start=term["start"],
        end=term["end"]
    )

    createdElection = Election.create(
        municipality_id=term["municipality_id"],
        office_id=term["office_id"],
        term_id=created.id,
        type=election["type"],
        election_date=election["election_date"]
    )

    return jsonify({
        "term": created.to_dict(), 
        "election": createdElection.to_dict()
    })

@app.route('/')
def index():
    return 'Hello world!', 200