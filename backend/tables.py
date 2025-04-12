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
    name = Column(String)
    email = Column(String)
    password = Column(String)

class Category(Base):
    __tablename__ = 'categories'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    name = Column(String)

class Item(Base):
    __tablename__ = 'items'
    id = Column(Integer, primary_key=True)
    category_id = Column(Integer, ForeignKey('categories.id'))
    title = Column(String)
    rating = Column(Integer)
    review = Column(String)
    image = Column(String)

# Create tables and .db file if it doesn't exist
Base.metadata.create_all(engine)

