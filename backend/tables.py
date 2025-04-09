import os
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

# Directory SQLite database file is defined in 
directory = 'backend'

# Name of SQLite file
db_filename = 'User.db'

# Full path of database using directory and file name
db_path = os.path.join(os.getcwd(), directory, db_filename)

# Engine object that connects to database through the directory and logs SQL statements to console
engine = create_engine(f'sqlite:///{db_path}', echo=True)

# Base class for database model classes
Base = declarative_base()

# Define model classes for database here
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String)
    password = Column(String)

# Create tables and .db file if it doesn't exist
Base.metadata.create_all(engine)

