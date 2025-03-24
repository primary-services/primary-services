from models import Municipality, MunicipalityType

from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
  pass

db = SQLAlchemy(model_class=Base)

# create the app
app = Flask(__name__)
# configure the SQLite database, relative to the app instance folder
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
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