from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from sqlalchemy import inspect,literal_column
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy_mixins import AllFeaturesMixin
from sqlalchemy.dialects.postgresql import insert

class SQLAlchemyBase(DeclarativeBase):
  pass

db = SQLAlchemy(model_class=SQLAlchemyBase)
    
class BaseModel(db.Model, AllFeaturesMixin):
    __abstract__ = True
    
    # TODO: Instead of making an instance with the populated fields, 
    # create an empty instance, replace it with an existing item if it 
    # exists, then populate the instance with the data fields. 
    # Do the same with associations and then upserting should work? 
    def parse(model, data):
      insp = inspect(model)
      
      # ID is always required for this function
      id_field = {
        "id": data["id"] or literal_column("DEFAULT"),
      }

      # Add all the fields in the JSON, if they exist in the model
      fields = {}
      for c in model.__table__.columns.keys():
        if (c == 'id'):
          fields[c] = data["id"] or literal_column("DEFAULT")
          continue

        if (c in data):
          fields[c] = data[c]
      
      instance = model(**fields)
      for relation in insp.relationships:
        key = relation.key
        if (key in data):
          if type(data[key]) is list:
            for childData in data[key]:
              child = BaseModel.parse(relation.mapper.class_, childData)
              getattr(instance, key).append(child)

      return instance

    def upsert(model, data):
      """Inserts or updates a model from a dict.

      Args:
        model: 
          SQLAlchemy Model Class
        data: 
          dict of fields to insert or update "id" is 
          required, but can be null if inserting

      Returns:
        The results of the insert/update as a the model

      Raises:
        Should probably do this huh? 
      """

      insp = inspect(db.engine)
      pk_constraint_name = insp.get_pk_constraint(model.__tablename__)["name"]

      # ID is always required for this function
      id_field = {
        "id": data["id"] or literal_column("DEFAULT"),
      }

      # Add all the fields in the JSON, if they exist in the model (except id)
      fields = {}
      for c in model.__table__.columns.keys():
        if (c == 'id'):
          continue

        if (c in data):
          fields[c] = data[c]

      # Insert Statement
      insert_stmt = insert(model).values({**id_field, **fields}).returning(literal_column('*'))
      # If the insert function fails, update
      on_duplicate_key_stmt = insert_stmt.on_conflict_do_update(
        constraint=pk_constraint_name, 
        set_=fields
      )

      # Run the statement and return the results
      results = db.session.execute(on_duplicate_key_stmt).mappings().all()

      return [model(**dict(r)) for r in results]

    def upsert_m2m(model, constraint, fields):
      """Inserts or updates a model from a dict.

      Args:
        model: 
          SQLAlchemy Model Class
        constraint
          Table's unique constraint name
        fields: 
          dict of id fields

      Returns:
        True if successful

      Raises:
        Should probably do this huh? 
      """

      # Insert Statement
      insert_stmt = insert(model).values(fields)
      # If the insert function fails, update
      on_duplicate_key_stmt = insert_stmt.on_conflict_do_nothing(
        constraint=constraint
      )

      # Run the statement and return the results
      results = db.session.execute(on_duplicate_key_stmt)

      # No Errors? 
      return True


BaseModel.set_session(db.session)