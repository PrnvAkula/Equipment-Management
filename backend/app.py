from flask import Flask, request, jsonify
from json import JSONEncoder
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import cast, Time, desc, extract, func
from flask_cors import CORS  
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta, date
import pytz
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
import os
from sqlalchemy import func, and_, or_
load_dotenv()
JWT_KEY = os.getenv('JWT_KEY')
REQUIRED_KEYWORD = os.getenv('REQUIRED_KEYWORD')
REQUIRED_KEYWORD_ADMIN = os.getenv('REQUIRED_KEYWORD_ADMIN')

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/equipdb?unix_socket=/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = JWT_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=5)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(hours=1)

jwt = JWTManager(app)
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
    doctorName = db.Column(db.String(100), nullable=False)
    bookingTime = db.Column(db.String(100), nullable=False)
    bookingDate = db.Column(db.String(100), nullable=False)
    def __init__(self,userid, branch, ename, surgeryType, toTime, fromTime, startDate, endDate, doctorName, bookingTime, bookingDate):
        self.userid = userid
        self.branch = branch
        self.ename = ename
        self.surgeryType = surgeryType
        self.toTime = toTime
        self.fromTime = fromTime
        self.startDate = startDate
        self.endDate = endDate
        self.doctorName = doctorName
        self.bookingTime = bookingTime
        self.bookingDate = bookingDate

    

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

today = datetime.now(pytz.timezone('Asia/Kolkata')).date()
now = datetime.now(pytz.timezone('Asia/Kolkata')).time() 
time_str = now.strftime('%H:%M')
time = datetime.strptime(f"{today} {time_str}", '%Y-%m-%d %H:%M').time()


@app.route('/register', methods=['POST'])
def register_user():

    data = request.get_json()
    user_id = data.get('userid')
    password = data.get('password')
    designation_str = data.get('designation')

    if designation_str == 'admin':
        if REQUIRED_KEYWORD_ADMIN not in user_id:
            return jsonify({"error": "Invalid Username (Keyword)"}), 400
    else:
        if REQUIRED_KEYWORD not in user_id:
            return jsonify({"error": "Invalid Username (Keyword)"}), 400

    userid = user_id.split("@")[1]
    if not password or not designation_str:
        return jsonify({"error": "Missing userid, password, or designation"}), 400
    if len(userid) > 20:
        return jsonify({"error": "User ID must be at most 20 characters long"}), 400
    if len(userid) < 5 or not userid:
        return jsonify({"error": "User ID must be at least 5 characters long after keyword"}), 400
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
    user = Registration.query.filter_by(userid=userid).first()
    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity={'id': user.userid, 'role': user.designation}, fresh=True)
        refresh_token = create_refresh_token(identity={'id': user.userid, 'role': user.designation})
        return jsonify({'message': 'Login successful' , 'username' : user.userid , 'designation' : user.designation, 'access_token' : access_token , 'refresh_token' : refresh_token}), 200
    else:
        return jsonify({'message': 'Invalid userid or password'}), 401
    
@app.route('/refresh', methods=['GET'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user, fresh=False)
    return jsonify({'access_token': access_token}), 200

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
    doctorName = data['doctorName']
    bookingTime = data['bookingTime']
    bookingDate = data['bookingDate']
    
    

    from_time = datetime.strptime(f"{fromTime}", '%H:%M').time()
    to_time = datetime.strptime(f"{toTime}", '%H:%M').time()


    if not branch:
        return jsonify({'error' : 'Branch field cannot be empty'}),400
    if not ename:
        return jsonify({'error' : 'Equipment field cannot be empty'}),400
    if not surgeryType:
        return jsonify({'error': 'Surgery Type cannot be empty'}), 400
    if not doctorName:
        return jsonify({'error': 'Doctor Name cannot be empty'}), 400
    try:
            inputStartDate = datetime.strptime(startDate, '%Y-%m-%d').date()
    except ValueError:
            return jsonify({'error': 'Invalid date format. Please use YYYY-MM-DD format.'}), 400
    try:
            inputEndDate = datetime.strptime(endDate, '%Y-%m-%d').date()
    except ValueError:
            return jsonify({'error': 'Invalid date format. Please use YYYY-MM-DD format.'}), 400
    if inputStartDate < today:
        return jsonify({'error': 'The \'Start\' date cannot be in the past. Please select today\'s date or a future date.'}), 400
    if inputEndDate < today:
        return jsonify({'error': 'The \'End\' date cannot be in the past. Please select today\'s date or a future date.'}), 400
    if inputEndDate < inputStartDate:
        return jsonify({'error': 'The \'End\' date cannot be before the \'Start\' date.'}), 400
    
    if inputEndDate == inputStartDate and from_time >= to_time:
        return jsonify({'error': 'The \'To\' time cannot be before or Equal to the \'Start\' time.'}), 400
    
    if (inputStartDate == today) and from_time < time:
        return jsonify({'error': 'The \'From\' time cannot be before the current Time. Please select a future time.'}), 400
    inputStart = datetime.combine(inputStartDate, from_time)
    inputEnd = datetime.combine(inputEndDate, to_time)
    cooldown = timedelta(hours=1)
    existing_bookings = BookingsTB.query.filter_by(ename=ename).all()
    for booking in existing_bookings:
        coolStart = datetime.combine(datetime.strptime(f"{booking.startDate}", '%Y-%m-%d').date(), datetime.strptime(f"{booking.fromTime}", '%H:%M').time())
        coolEnd = datetime.combine(datetime.strptime(f"{booking.endDate}", '%Y-%m-%d').date(), datetime.strptime(f"{booking.toTime}", '%H:%M').time())
        if branch != booking.branch:
            coolStart = (coolStart - cooldown)
            coolEnd = (coolEnd + cooldown)
        if inputStart < coolEnd and inputEnd > coolStart:
            return jsonify({'error': 'The Equipments have a cooldown time of 1 hour'}), 400

    new_equipment = BookingsTB(doctorName=doctorName, userid=userid, branch=branch, ename=ename, surgeryType=surgeryType, toTime=toTime, fromTime=fromTime, startDate=startDate, endDate=endDate, bookingTime=bookingTime, bookingDate=bookingDate)
    db.session.add(new_equipment)
    db.session.commit()
    return jsonify({'message': 'Equipment Booked successfully'}), 201


@app.route('/data', methods=['GET'])
def get_data():
    data = BookingsTB.query.order_by(BookingsTB.startDate,(cast(BookingsTB.fromTime, Time)), BookingsTB.endDate ,(cast(BookingsTB.toTime, Time))).all()
    if len(data) == 0:
        return jsonify({'message': 'There are No Bookings'}), 404
    result = [{'id': row.id,
            'userid': row.userid,
            'branch': row.branch,
            'ename': row.ename,
            'surgeryType': row.surgeryType,
            'startDate': row.startDate.strftime('%a, %d %b %Y'),
            'fromTime': row.fromTime,
            'endDate': row.endDate.strftime('%a, %d %b %Y'),
            'toTime': row.toTime,
            'doctorName': row.doctorName,
            'bookingTime': row.bookingTime,
            'bookingDate': row.bookingDate
            } for row in data]  
    return jsonify(result)

@app.route('/editing', methods=['GET'])
def get_items_by_user():
    data = BookingsTB.query.order_by(desc(BookingsTB.startDate) ,desc((cast(BookingsTB.fromTime, Time))),desc(BookingsTB.endDate), desc(cast(BookingsTB.toTime, Time) )).all()
    if len(data) == 0:
        return jsonify({'message': 'There are No Bookings'}), 404
    result = [{'id': row.id,
            'userid': row.userid,
            'branch': row.branch,
            'ename': row.ename,
            'surgeryType': row.surgeryType,
            'startDate': row.startDate.strftime('%a, %d %b %Y'),
            'fromTime': row.fromTime,
            'endDate': row.endDate.strftime('%a, %d %b %Y'),
            'toTime': row.toTime, 
            'doctorName': row.doctorName,
            'bookingTime': row.bookingTime,
            'bookingDate': row.bookingDate
            } for row in data] 
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
    

from datetime import datetime, timedelta

@app.route('/editbooking/<int:Id>', methods=['PUT'])
def edit_booking(Id):
    booking = BookingsTB.query.filter_by(id=Id).first()

    if not booking:
        return jsonify({'message': 'Booking not found'}), 404

    data = request.get_json()


    toTime = data.get('toTime', booking.toTime)
    fromTime = data.get('fromTime', booking.fromTime)
    startDate = data.get('startDate', booking.startDate)
    endDate = data.get('endDate', booking.endDate)
    branch = data.get('branch', booking.branch)
    ename = data.get('ename', booking.ename)

    if not startDate or not endDate:
        return jsonify({'error': 'Start date and end date are required.'}), 400

    try:
        from_time = datetime.strptime(fromTime, '%H:%M').time()
        to_time = datetime.strptime(toTime, '%H:%M').time()
    except ValueError:
        return jsonify({'error': 'Invalid time format. Please use HH:MM format.'}), 400

    try:
        inputStartDate = datetime.strptime(startDate, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Please use YYYY-MM-DD format for start date.'}), 400

    try:
        inputEndDate = datetime.strptime(endDate, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Please use YYYY-MM-DD format for end date.'}), 400

    if inputStartDate < today:
        return jsonify({'error': 'The \'Start\' date cannot be in the past. Please select today\'s date or a future date.'}), 400
    if inputEndDate < today:
        return jsonify({'error': 'The \'End\' date cannot be in the past. Please select today\'s date or a future date.'}), 400
    
    if inputEndDate < inputStartDate:
        return jsonify({'error': 'The \'End\' date cannot be before the \'Start\' date.'}), 400
    
    if inputEndDate == inputStartDate and from_time >= to_time:
        return jsonify({'error': 'The \'To\' time cannot be before or Equal to the \'Start\' time.'}), 400
    
    if (inputStartDate == today) and from_time < time:
        return jsonify({'error': 'The \'From\' time cannot be before the current Time. Please select a future time.'}), 400
    
    booking.fromTime = fromTime
    booking.toTime = toTime
    booking.startDate = startDate
    booking.endDate = endDate
    booking.branch = branch

    try:
        db.session.commit()
        return jsonify({'message': 'Booking updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to update booking', 'error': str(e)}), 500

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
    data = Equipment.query.order_by(Equipment.equipment).all()

    result = [{'id': row.id,
            'equipment': row.equipment
            } for row in data]
    return jsonify(result)

@app.route('/equipment/<ename>', methods=['GET'])

def get_equipment_by_id(ename):
    equipment = BookingsTB.query.filter(BookingsTB.endDate >= today).filter(BookingsTB.toTime >= time).filter_by(ename = ename).all()
    if equipment:
        result = [{'id': row.id,
            'userid': row.userid,
            'branch': row.branch,
            'ename': row.ename,
            'surgeryType': row.surgeryType,
            'startDate': row.startDate.strftime('%a, %d %b %Y'),
            'fromTime': row.fromTime,
            'endDate': row.endDate.strftime('%a, %d %b %Y'),
            'toTime': row.toTime,
            'doctorName': row.doctorName,
            'bookingTime': row.bookingTime,
            'bookingDate': row.bookingDate
            } for row in equipment]
        return jsonify(result)
    else:
        return jsonify({'message': f'There are no Bookings for {ename}'}), 404

@app.route('/Sortby')
def sort_by():
    sort_by = request.args.get('sort_by', '')  
    sort = request.args.get('sort', '')
    if sort:
        if sort_by == 'Date':
            query = BookingsTB.query.filter(BookingsTB.startDate == sort)
        elif sort_by == 'Branch':
            query = BookingsTB.query.filter(BookingsTB.branch == sort)
        elif sort_by == 'Equipment':
            query = BookingsTB.query.filter(BookingsTB.ename == sort) 
    else:
        if sort_by == 'Active':
            today1 = datetime.now(pytz.timezone('Asia/Kolkata')).date()
            time_str1 = now.strftime('%H:%M')
            time1 = datetime.strptime(f"{today1} {time_str1}", '%Y-%m-%d %H:%M').time()
            query = BookingsTB.query.filter(
                (BookingsTB.endDate > today1) |
                ((BookingsTB.endDate == today1) & (BookingsTB.toTime >= time1))
            )
        elif sort_by == 'Date':
            query = BookingsTB.query.order_by(BookingsTB.startDate,(cast(BookingsTB.fromTime, Time)), BookingsTB.endDate ,(cast(BookingsTB.toTime, Time)))
        elif sort_by == 'Branch':
            query = BookingsTB.query.order_by(BookingsTB.branch)
        elif sort_by == 'Equipment':
            query = BookingsTB.query.order_by(BookingsTB.ename)    
    sorted_items = query.all()
    if sort_by == 'Active':
        if len(sorted_items) == 0:
            return jsonify({'message': f'There are No Active Bookings'}), 404
    if sort_by == 'Date':
        if len(sorted_items) == 0:
            return jsonify({'message': f'There are No Bookings on {sort}'}), 404
    elif sort_by == 'Branch':
        if len(sorted_items) == 0:
            return jsonify({'message': f'There are No Bookings for {sort}'}), 404
    elif sort_by == 'Equipment':
        if len(sorted_items) == 0:
            return jsonify({'message': f'There are No Bookings for {sort}'}), 404
    result = [{'id': row.id,
            'userid': row.userid,
            'branch': row.branch,
            'ename': row.ename,
            'surgeryType': row.surgeryType,
            'startDate': row.startDate.strftime('%a, %d %b %Y'),
            'fromTime': row.fromTime,
            'endDate': row.endDate.strftime('%a, %d %b %Y'),
            'toTime': row.toTime,
            'doctorName': row.doctorName,
            'bookingTime': row.bookingTime,
            'bookingDate': row.bookingDate
            } for row in sorted_items]
    return jsonify(result)

@app.route('/datacount/<sortBy>', methods=['GET'])
def count_bookings_by_equipment(sortBy):
    month = request.args.get('month')
    if month:
        start_date = datetime.strptime(month, '%Y-%m')
        end_date = datetime(start_date.year, start_date.month + 1, 1) if start_date.month < 12 else datetime(start_date.year + 1, 1, 1)
    else:
        start_date = None
        end_date = None

    # Query for existing equipment
    query_existing = db.session.query(
        Equipment.equipment,
        func.count(BookingsTB.id).label('booking_count')
    ).outerjoin(BookingsTB, and_(
        Equipment.equipment == BookingsTB.ename,
        BookingsTB.branch == sortBy
    ))

    if start_date and end_date:
        query_existing = query_existing.filter(BookingsTB.startDate >= start_date, BookingsTB.startDate < end_date)

    query_existing = query_existing.group_by(Equipment.equipment)

    # Query for deleted equipment
    subquery = db.session.query(Equipment.equipment).subquery()
    query_deleted = db.session.query(
        BookingsTB.ename.label('equipment'),
        func.count(BookingsTB.id).label('booking_count')
    ).filter(
        and_(
            BookingsTB.ename.notin_(subquery),
            BookingsTB.branch == sortBy
        )
    )
    if start_date and end_date:
        query_deleted = query_deleted.filter(BookingsTB.startDate >= start_date, BookingsTB.startDate < end_date)

    query_deleted = query_deleted.group_by(BookingsTB.ename)

    # Combine results
    results_existing = query_existing.all()
    results_deleted = query_deleted.all()

    # Convert results to a list of dictionaries
    bookings_list = [{'equipment_name': equipment, 'booking_count': count} for equipment, count in results_existing]
    bookings_list += [{'equipment_name': equipment, 'booking_count': count} for equipment, count in results_deleted]
    if not bookings_list:
        return jsonify({'message': 'No equipment was used during the selected period.'}), 404
    return jsonify(bookings_list)


if __name__ == '__main__':
    app.run(debug=True)


