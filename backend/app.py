# 
from flask import Flask, request, jsonify
from json import JSONEncoder
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
CORS(app)  # Enable CORS

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/equipdb?unix_socket=/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class BookingsTB(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.String(100), nullable=False)
    branch = db.Column(db.String(100), nullable=False)
    ename = db.Column(db.String(100), nullable=False)
    toTime = db.Column(db.String(100), nullable=False)
    fromTime = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date)
    surgeryType = db.Column(db.String(100), nullable=False)
    def __init__(self,userid, branch, ename, surgeryType, toTime, fromTime, date):
        self.userid = userid
        self.branch = branch
        self.ename = ename
        self.surgeryType = surgeryType
        self.toTime = toTime
        self.fromTime = fromTime
        self.date = date

class Registration(db.Model):
    userid = db.Column(db.String(100), nullable=False, primary_key=True)
    password_hash = db.Column(db.String(300), nullable=False)
    designation = db.Column(db.String(100), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
with app.app_context():
    db.create_all()


@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    userid = data.get('userid')
    password = data.get('password')
    designation_str = data.get('designation')
    if not userid or not password or not designation_str:
        return jsonify({"error": "Missing userid, password, or designation"}), 400
    new_user = Registration(userid=userid, designation=designation_str,)
    Registration.set_password(new_user, password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Registration successful", "userid": userid, "designation": designation_str})
#login authentication

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    userid = data['userid']
    password = data['password']

    user = None
    user = Registration.query.filter_by(userid=userid).first()
    if user and check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Login successful' , 'username' : user.userid , 'designation' : user.designation}), 200
    else:
        return jsonify({'message': 'Invalid userid or password'}), 401
 
#adding an equipment
# @app.route('/add_equipment', methods=['POST'])
# def add_equipment():
#     data = request.get_json()
#     userid = data['username']
#     branch = data['branch']
#     ename = data['ename']
#     surgeryType = data['surgeryType']
#     toTime = data['toTime']
#     fromTime = data['fromTime']
#     date = data['date']
#     new_equipment = Equipment(userid=userid,branch=branch, ename=ename, surgeryType=surgeryType, toTime=toTime, fromTime=fromTime, date=date)
#     db.session.add(new_equipment)
#     db.session.commit()
#     return jsonify({'message': 'New equipment added'}), 201
@app.route('/booking', methods=['POST'])
def booking():
    data = request.get_json()
    userid = data['username']
    branch = data['branch']
    ename = data['ename']
    surgeryType = data['surgeryType']
    toTime = data['toTime']
    fromTime = data['fromTime']
    date = data['date']

    #Check if surgeryType is empty
    if not surgeryType:
        return jsonify({'error': 'Surgery Type cannot be empty'}), 400

    existing_bookings = BookingsTB.query.filter_by(ename=ename, date=date).all()

    # Check for time overlap
    for booking in existing_bookings:
        if (fromTime < booking.toTime and toTime > booking.fromTime):
            return jsonify({'error': 'Timings are clashing with other appointments. Please select different timings and try again.'}), 400

    #If no overlap, add the new booking
    new_equipment = BookingsTB(userid=userid, branch=branch, ename=ename, surgeryType=surgeryType, toTime=toTime, fromTime=fromTime, date=date)
    db.session.add(new_equipment)
    db.session.commit()
    return jsonify({'message': 'Equipment Booked successfully'}), 201



@app.route('/data', methods=['GET'])
def get_data():
    data = BookingsTB.query.all()
    result = [{'id': row.id,
            'userid': row.userid,
            'branch': row.branch,
            'ename': row.ename,
            'surgeryType': row.surgeryType,
            'fromTime': row.fromTime,
            'toTime': row.toTime,
            'date': row.date
            } for row in data]  # Adjust to include all necessary fields
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)