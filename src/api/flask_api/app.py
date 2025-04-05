from models import db, Municipality, MunicipalityType, Official, Office
from flask import Flask, jsonify, request
from flask_cors import CORS
from creds import CredentialsManager

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
    towns = Municipality.where(type=MunicipalityType.TOWN).all()
    return jsonify([town.to_dict() for town in towns]), 200

@app.post("/town")
def create_town():
    town = request.json
    print(town)

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
            title="Clerk",
            description="Current Town Clerk",
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

@app.route('/')
def index():
    return 'Hello world!', 200