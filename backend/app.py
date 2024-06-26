# 
from flask import Flask, request, jsonify
from json import JSONEncoder
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


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
    startDate = db.Column(db.Date)
    endDate = db.Column(db.Date)
    surgeryType = db.Column(db.String(100), nullable=False)
    def __init__(self,userid, branch, ename, surgeryType, toTime, fromTime, startDate, endDate):
        self.userid = userid
        self.branch = branch
        self.ename = ename
        self.surgeryType = surgeryType
        self.toTime = toTime
        self.fromTime = fromTime
        self.startDate = startDate
        self.endDate = endDate

class Registration(db.Model):
    userid = db.Column(db.String(100), nullable=False, primary_key=True)
    password_hash = db.Column(db.String(300), nullable=False)
    designation = db.Column(db.String(100), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Equipment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    equipment = db.Column(db.String(100), nullable=False)
    
    
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
    if len(userid) > 20:
        return jsonify({"error": "User ID must be at most 20 characters long"}), 400
    if len(userid) < 5:
        return jsonify({"error": "User ID must be at least 5 characters long"}), 400
    if Registration.query.filter_by(userid=userid).first():
        return jsonify({"error": "User already exists"}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters long"}), 400
    if len(password) > 20:
        return jsonify({"error": "Password must be at most 20 characters long"}), 400
    
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
 

@app.route('/booking', methods=['POST'])
def booking():
    data = request.get_json()
    userid = data['username']
    branch = data['branch']
    ename = data['ename']
    surgeryType = data['surgeryType']
    toTime = data['toTime']
    fromTime = data['fromTime']
    startDate = data['startDate']
    endDate = data['endDate']

    if not branch:
        return jsonify({'error' : 'branch field cannot be empty'}),400
    if not ename:
        return jsonify({'error' : 'equipment field cannot be empty'}),400
    if not surgeryType:
        return jsonify({'error': 'Surgery Type cannot be empty'}), 400

    # existing_bookings = BookingsTB.query.filter_by(ename=ename, startDate=startDate,endDate=endDate).all()

    # for booking in existing_bookings:
    #     # Convert stored string times to datetime.time objects
    #     existing_from_time = datetime.strptime(booking.fromTime, '%H:%M').time()
    #     existing_to_time = datetime.strptime(booking.toTime, '%H:%M').time()
    #     request_from_time = datetime.strptime(fromTime, '%H:%M').time()
    #     request_to_time = datetime.strptime(toTime, '%H:%M').time()

    #     # Check for overlap
    #     if (request_from_time < existing_to_time and request_to_time > existing_from_time):
    #         return jsonify({'error': 'Timings are clashing with other Bookings. Please select different timings and try again.'}), 400
    request_start_datetime = datetime.strptime(startDate + " " + fromTime, '%Y-%m-%d %H:%M')
    request_end_datetime = datetime.strptime(endDate + " " + toTime, '%Y-%m-%d %H:%M')
    existing_bookings = BookingsTB.query.filter_by(ename=ename).all()

    for booking in existing_bookings:
        # Convert stored strings to datetime objects
        existing_start_datetime = datetime.strptime(booking.startDate + " " + booking.fromTime, '%d-%m-%Y %H:%M')
        existing_end_datetime = datetime.strptime(booking.endDate + " " + booking.toTime, '%d-%m-%Y %H:%M')

        # Check for overlap
        if (request_start_datetime < existing_end_datetime and request_end_datetime > existing_start_datetime):
            return jsonify({'error': 'Timings are clashing with other Bookings. Please select different timings and try again.'}), 400

    #If no overlap, add the new booking


    new_equipment = BookingsTB(userid=userid, branch=branch, ename=ename, surgeryType=surgeryType, toTime=toTime, fromTime=fromTime, startDate=startDate, endDate=endDate)
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
            'startDate': row.startDate,
            'fromTime': row.fromTime,
            'endDate': row.endDate,
            'toTime': row.toTime
            } for row in data]  # Adjust to include all necessary fields
    return jsonify(result)

@app.route('/data/<userId>', methods=['GET'])
def get_items_by_user(userId):
    data = BookingsTB.query.filter_by(userid=userId).all()
    if len(data) == 0:
        return jsonify({'message': 'You Have No Bookings'}), 404
    result = [{'id': row.id,
            'userid': row.userid,
            'branch': row.branch,
            'ename': row.ename,
            'surgeryType': row.surgeryType,
            'startDate': row.startDate.strftime('%a, %d %b %Y'),
            'fromTime': row.fromTime,
            'endDate': row.endDate.strftime('%a, %d %b %Y'),
            'toTime': row.toTime
            } for row in data] # Adjust fields as necessary
    return jsonify(result)

@app.route('/bookings/<int:Id>', methods=['DELETE'])
def delete_booking(Id):
    booking = BookingsTB.query.filter_by(id = Id).first()
    
    if booking:
        db.session.delete(booking)
        db.session.commit()
        return jsonify({'message': 'Booking deleted successfully'}), 200
    else:
        return jsonify({'message': 'Booking not found'}), 404

@app.route('/addequipment', methods=['POST'])
def add_equipment():
    data = request.get_json()
    equipment = data['newEquipment']
    if not equipment:
        return jsonify({'error': 'Equipment field cannot be empty'}), 400
    new_equipment = Equipment(equipment=equipment)
    db.session.add(new_equipment)
    db.session.commit()
    return jsonify({'message': 'Equipment added successfully', 'id' : new_equipment.id}), 201
    
@app.route('/deleteequipment/<int:Id>', methods=['DELETE'])
def delete_equipment(Id):
    equipment = Equipment.query.filter_by(id = Id).first()
    if equipment:
        db.session.delete(equipment)
        db.session.commit()
        return jsonify({'message': 'Equipment deleted successfully'}), 200
    else:
        return jsonify({'message': 'Equipment not found'}), 404
    
@app.route('/equipment', methods=['GET'])
def get_equipment():
    data = Equipment.query.all()
    result = [{'id': row.id,
            'equipment': row.equipment
            } for row in data]
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)