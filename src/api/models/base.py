from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy_mixins import AllFeaturesMixin

class SQLAlchemyBase(DeclarativeBase):
  pass

db = SQLAlchemy(model_class=SQLAlchemyBase)
    
class BaseModel(db.Model, AllFeaturesMixin):
    __abstract__ = True
    pass

BaseModel.set_session(db.session)