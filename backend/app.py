# 
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  
from werkzeug.security import generate_password_hash, check_password_hash
from enum import Enum, auto

app = Flask(__name__)
CORS(app)  # Enable CORS

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/equipdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

#CREATING THE REQUIRED TABLES:

#creating a user tables:
class Staff(db.Model):
    userid = db.Column(db.String(100), unique=True, nullable=False, primary_key=True)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Doctor(db.Model):
    userid = db.Column(db.String(100), unique=True, nullable=False, primary_key=True)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
class Designation(Enum):
    STAFF = auto()
    DOCTOR = auto()

    @staticmethod
    def from_string(s):
        if s.lower() == 'staff':
            return Designation.STAFF
        elif s.lower() == 'doctor':
            return Designation.DOCTOR
        else:
            raise ValueError("Invalid designation")
    


#creating a equipment table
class Equipment(db.Model):
    eid = db.Column(db.Integer, primary_key=True)
    ename = db.Column(db.String(100), nullable=False)

    def __init__(self, eid, ename):
        self.eid = eid
        self.ename = ename



with app.app_context():
    db.create_all()





#THE FUNCTIONS:

#registering a user
# @app.route('/register', methods=['POST'])
# def register_user():
#     data = request.json
#     userid = data.get('userid')
#     password = data.get('password')
#     designation = data.get('designation')
    
#     if designation == 'Staff':
#         user = Staff(userid=userid)
#         user.set_password(password)  # Hash the password
#     elif designation == 'Doctor':
#         user = Doctor(userid=userid)
#         user.set_password(password)  # Hash the password
#     else:
#         return jsonify({"error": "Invalid designation"}), 400
    
#     db.session.add(user)
#     db.session.commit()
    
#     return jsonify({"message": "Registration successful", "userid": userid, "designation": designation})
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    userid = data.get('userid')
    password = data.get('password')
    designation_str = data.get('designation')

    if not userid or not password or not designation_str:
        return jsonify({"error": "Missing userid, password, or designation"}), 400

    try:
        designation = Designation.from_string(designation_str)
    except ValueError:
        return jsonify({"error": "Invalid designation"}), 400

    user = None
    if designation == Designation.STAFF:
        user = Staff(userid=userid)
    elif designation == Designation.DOCTOR:
        user = Doctor(userid=userid)
    else:
        return jsonify({"error": "Invalid designation"}), 400

    user.set_password(password)
    try:
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "User registration failed", "message": str(e)}), 500

    return jsonify({"message": "Registration successful", "userid": userid, "designation": designation.name})


#login authentication
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    userid = data['userid']
    password = data['password']
    designation = data.get('designation')

    user = None
    if designation == 'Doctor':
        user = Doctor.query.filter_by(userid=userid).first()
    elif designation == 'Staff':
        user = Staff.query.filter_by(userid=userid).first()

    if user and check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid userid or password'}), 401
    
    
#adding an equipment
@app.route('/add_equipment', methods=['POST'])
def add_equipment():
    data = request.get_json()
    eid = data['eid']
    ename = data['ename']
    new_equipment = Equipment(eid=eid, ename=ename)
    db.session.add(new_equipment)
    db.session.commit()
    return jsonify({'message': 'New equipment added'}), 201










if __name__ == '__main__':
    app.run(debug=True)