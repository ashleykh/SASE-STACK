from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import sessionmaker
from werkzeug.security import generate_password_hash
from tables import User
import os
import re

# Create a flask app 
app = Flask(__name__, template_folder = 'frontend', static_folder = 'frontend')
app.secret_key = 'secret_key'

# Allow frontend requests to backend
CORS(app, origins=["http://127.0.0.1:5500"], methods=["GET", "POST", "OPTIONS"])


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

info = {
  'ding tea': {'wintermelon milk tea': {'rating': 5, 'review': 'good'},
               'peach oolong tea': {'rating': 4, 'review': 'good'}},
  'kungfu tea': {'mango milk tea': {'rating': 5, 'review': 'good'}}
}

### THIS IS FOR THE SERVER ###
@app.route('/sign-up', methods=['POST'])
def sign_up():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm-password')

    if not all([name, email, password, confirm_password]):
        return jsonify({'status': 'error', 'message': 'All fields are required'}), 400

    if password != confirm_password:
        return jsonify({'status': 'error', 'message': 'Passwords do not match'}), 400

    session = Session()

    # Check if user already exists
    existing_user = session.query(User).filter_by(email=email).first()
    if existing_user:
        session.close()
        return jsonify({'status': 'error', 'message': 'User already exists'}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Create new user
    new_user = User(name=name, email=email, password=hashed_password)

    # Add to database
    session.add(new_user)
    session.commit()
    session.close()

    return jsonify({'status': 'success', 'message': 'User registered successfully'})

if __name__ == '__main__':
    app.run(debug=True)

