# 
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Import the CORS class

app = Flask(__name__)
CORS(app)  # Enable CORS

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/equipdb?unix_socket=/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Equipment(db.Model):
    eid = db.Column(db.Integer, primary_key=True)
    ename = db.Column(db.String(100), nullable=False)

    def __init__(self, eid, ename):
        self.eid = eid
        self.ename = ename

# Create the tables
with app.app_context():
    db.create_all()

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