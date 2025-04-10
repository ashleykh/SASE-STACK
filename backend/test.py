from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from tables import Base, User
import os

'''
Example of how to populate the User database manually through backend
Does not take input from front end
Program creates new engine and session separate from flask_sever.py
echo=True for debugging prints queries in format: 2025-04-09 00:38:59,171 INFO sqlalchemy.engine.Engine  
Run Command: Python3 backend/test.py 
'''

directory = 'backend'
db_filename = 'User.db'
db_path = os.path.join(os.getcwd(), directory, db_filename)

engine = create_engine(f"sqlite:///{db_path}", echo=True, connect_args={"check_same_thread":False})

Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

# New User attributes to add to database
#new_user = User(username='sase stack', password='password')
# Delete all entries from User table
session.query(User).delete() # Delete all users from database
session.commit()

# Get user that has username 'sase stack'
'''added_user = session.query(User).filter_by(username='sase stack').first()
if added_user:
    print(f"################################# User {added_user.username} added to database #################################")
else:
    print("Not added")
'''

session.close()