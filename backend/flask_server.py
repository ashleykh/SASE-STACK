from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Sample data storage
data_store = {"user_info": "NA"}

# GET request
@app.route('/get-message', methods=['GET'])
def get_message():
    return jsonify(data_store)

# POST request
@app.route('/frontend/login', methods=['POST'])
def get_login_info():
    email = request.json.get('email')
    password = request.json.get('password')
    if email and password:
        data_store["user_info"] = {"email": email, "password": password}
        return jsonify("Account logged in"), 200
    return jsonify({"status": "error", "message": "Invalid input!"}), 400


if __name__ == '__main__':
    app.run(debug=True)