from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import sessionmaker
from tables import User
import os
import re

# Create a flask app 
app = Flask(__name__, template_folder = 'frontend', static_folder = 'frontend')
app.secret_key = 'secret_key'

# Allow frontend requests to backend
CORS(app)

directory = 'backend'
db_filename = 'User.db'
db_path = f"{os.path.join(os.getcwd(), directory, db_filename)}"

# Create an engine object and a session object to connect to database and query/commit data
engine = create_engine(f"sqlite:///{db_path}", echo=True, connect_args={"check_same_thread":False})
Session = sessionmaker(bind=engine)
session = Session()

# Put session queries/commits here
users = session.query(User).all()

session.close()

