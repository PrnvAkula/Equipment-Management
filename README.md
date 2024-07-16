This Web Application is built using React.js for the frontend and Python Flask for the backend.
Steps to setup the application:
  In the frontend folder:
    1) npm install react-router-dom
    2) npm isntall axios
    3) npm install react-bootstrap bootstrap
    4) npm install jwt-decode

  In the backend folder:
    1) pip install flask
    2) pip install flask_sqlalchemy
    3) pip install -U flask-cors
    4) pip install mysqlclient
    5) pip install flask_jwt_extended
    6) pip install pytz
    6) pip install python-dotnet

Steps to start the application:
  When a new contributor sets up the project, they should copy .env.example to a new file named .env in their local environment and replace the placeholders with their own values. 
  (.env.example file serves as a clear, safe template for setting up the project environment without interfering with actual environment variables.)
  Run mySQL in phpmyadmin after creating a database called equipdb (change your password in the app.py if u have your own account) 
  To start the frontend: npm start (inside the frontend folder)
  To start the backend: python app.py (inside the backend folder)
