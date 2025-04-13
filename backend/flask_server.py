from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import sessionmaker
from werkzeug.security import generate_password_hash, check_password_hash
from tables import User, Category, Item
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

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'status': 'error', 'message': 'All fields are required'}), 400

    session = Session()

    # Check if user exists
    user = session.query(User).filter_by(email=email).first()
    if not user:
        session.close()
        return jsonify({'status': 'error', 'message': 'User does not exist'}), 400

    # Check password
    if not check_password_hash(user.password, password):
        session.close()
        return jsonify({'status': 'error', 'message': 'Invalid password'}), 400

    session.close()
    return jsonify({'status': 'success', 'message': 'Login successful', 'id': user.id})

@app.route('/add-category',methods=['POST'])
def add_category():
    data = request.get_json()
    user_id = data.get('user_id')
    category_name = data.get('category_name')

    if not all([user_id,category_name]):
        return jsonify({'status': 'error', 'message': 'All fields are required'}), 400
    
    session = Session()
    user = session.query(User).filter_by(id=user_id).first()
    if(user):
        new_category = Category(user_id=user_id,name=category_name)
        session.add(new_category)
        session.commit()
        session.close()

        return jsonify({'status': 'success', 'message': 'Category added'})
    else:
        session.close()
        return jsonify({'status': 'error', 'message': 'User does not exist'}), 400

@app.route('/get-category-list',methods=['GET'])
def get_category_list():
    data = request.headers
    user_id = data.get('userid')

    if not all([user_id]):
        return jsonify({'status': 'error', 'message': 'All fields are required'}), 400

    session = Session()
    user = session.query(User).filter_by(id=user_id).first()

    if(user):
        result = session.query(Category).filter_by(user_id=user_id).all()
        category_list = {}

        session.close()
        if(result):
            for category in result:
                category_list[category.id] = category.name
            
            if(len(category_list) > 0):
                return jsonify({'status': 'success', 'category_list': category_list})
        
        return jsonify({'status': 'error', 'message': 'No categories'}), 400
    else:
        session.close()
        return jsonify({'status': 'error', 'message': 'No user'}), 400

def get_category_list(user_id):
    session = Session()
    user = session.query(User).filter_by(id=user_id).first()

    if(user):
        result = session.query(Category).filter_by(user_id=user_id).all()
        category_list = {}

        session.close()
        if(result):
            for category in result:
                category_list[category.id] = category.name
            return category_list
    else:
        session.close()
        return(None)

def get_item_list(category_id):
    session = Session()
    category = session.query(Category).filter_by(id=category_id).first()

    if(category):
        result = session.query(Item).filter_by(category_id=category_id).all()
        session.close()
        if(not result):
            return (None)

        item_list = {}
        for item in result:
            item_list[item.title] = {'rating': item.rating, 'review': item.review, 'image': item.image}
            # item_list.append({'title': item.title, 'rating': item.rating, 'review': item.review, 'image': item.image})
        
        return item_list
    else:
        session.close()
        return(None)

@app.route('/add-item',methods=['POST'])
def add_item():
    data = request.get_json()
    # category_id = data.get('category_id')
    user_id = data.get('user_id')
    category_name = data.get('category_name')
    title = data.get('title')
    rating = data.get('rating')
    review = data.get('review')
    image = data.get('image')

    if not all([category_name, title, rating, review, image]):
        return jsonify({'status': 'error', 'message': 'All fields are required'}), 400
    
    session = Session()
    category = session.query(Category).filter_by(user_id=user_id, name=category_name).first()
    if(category):
        new_item = Item(category_id=category.id, title=title, rating=rating, review=review, image=image)
        session.add(new_item)
        session.commit()
        session.close()

        return jsonify({'status': 'success', 'message': 'Item added'})
    else:
        session.close()
        return jsonify({'status': 'error', 'message': 'Invalid category id'}), 400

#get categories with items together
@app.route('/user-info',methods=['GET'])
def get_user_info():
    data = request.headers
    user_id = data.get('userid')

    session = Session()
    user = session.query(User).filter_by(id=user_id).first()

    if not all([user_id]):
        session.close()
        return jsonify({'status': 'error', 'message': 'All fields are required'}), 400

    if(not user):
        session.close()
        return jsonify({'status': 'error', 'message': 'Invalid user'}), 400

    session.close()
    category_list = get_category_list(user_id)

    info = {}

    if(category_list):
        for category_id in category_list:
            item_list = get_item_list(category_id)
            category_name = category_list[category_id]
            info[category_name] = item_list
        
        return jsonify({'status': 'success', 'info': info})
    else:
        return jsonify({'status': 'error', 'message': 'No categories'}), 400

if __name__ == '__main__':
    app.run(debug=True)

