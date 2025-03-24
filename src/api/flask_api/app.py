from models import db, Municipality, MunicipalityType
from flask import Flask, jsonify
from creds import CredentialsManager

# create the app
app = Flask(__name__)
# configure the SQLite database, relative to the app instance folder
app.config["SQLALCHEMY_DATABASE_URI"] = CredentialsManager().get_db_url()
# initialize the app with the extension
db.init_app(app)

with app.app_context():
    db.create_all()
    
@app.get("/towns")
def get_towns():
   query = db.select(Municipality).where(Municipality.type == MunicipalityType.TOWN)
   towns = db.session.execute(query).scalars()
   return jsonify(towns, status=200)

@app.route('/')
def index():
    return jsonify(status=200, message='Hello Flask!')