from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from cryptography.fernet import Fernet
import os
import time
import random

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

# Generate a key for encryption
encryption_key = Fernet.generate_key()
cipher_suite = Fernet(encryption_key)


def create_app():
    app = Flask(__name__)

    # Configuration for the app
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'secret123')
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'secret1234')
    app.config['SESSION_TYPE'] = 'filesystem'  # Store session data on the filesystem

    # Configure CORS
    CORS(app, resources={r"/*": {"origins": "*"}})

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    @app.before_request
    def check_app_version():
        app_version = request.headers.get('app-version', '0.0.0')
        if app_version < '1.2.0':
            return jsonify({'message': 'Please update your client application to the latest version.'}), 426

    with app.app_context():
        db.create_all()

    @app.route('/')
    def index():
        return jsonify({'status': 200})

    @app.route('/register', methods=['POST'])
    def register():
        data = request.get_json()
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        encrypted_motto = cipher_suite.encrypt(data['motto'].encode()).decode('utf-8')
        new_user = User(
            username=data['username'],
            password=hashed_password,
            name=data['name'],
            bio=data['bio'],
            profile_pic_url=data['profile_pic_url'],
            motto=encrypted_motto
        )
        db.session.add(new_user)
        db.session.commit()
        access_token = create_access_token(identity={'username': data['username']})
        session['access_token'] = access_token
        return jsonify({'message': 'User registered successfully'}), 201

    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if user and bcrypt.check_password_hash(user.password, data['password']):
            access_token = create_access_token(identity={'username': user.username})
            session['access_token'] = access_token  # Store token in the session
            return jsonify({'message': 'Login successful'}), 200
        return jsonify({'message': 'Invalid credentials'}), 401

    @app.route('/user', methods=['GET'])
    @jwt_required()
    def user():
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user['username']).first()
        if user:
            decrypted_motto = cipher_suite.decrypt(user.motto.encode()).decode('utf-8')
            user_data = {
                'username': user.username,
                'id': user.id,
                'motto': decrypted_motto
            }
            return jsonify(user_data), 200
        return jsonify({'message': 'User not found'}), 404

    def mock_transcription(audio_file):
        # Simulate a random delay
        time.sleep(random.randint(2, 5))
        # Mock transcription
        return "This is a mock transcription of the uploaded audio."

    @app.route('/upload', methods=['POST'])
    @jwt_required()
    def upload():
        if 'audio' not in request.files:
            return jsonify({'message': 'No audio file part'}), 400
        audio = request.files['audio']
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user['username']).first()
        if user:
            # Mock the transcription process
            transcription = mock_transcription(audio)
            encrypted_motto = cipher_suite.encrypt(transcription.encode()).decode('utf-8')
            user.motto = encrypted_motto
            db.session.commit()
            return jsonify({'message': 'Transcription complete', 'transcription': transcription}), 200
        return jsonify({'message': 'User not found'}), 404

    return app


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    bio = db.Column(db.String(500), nullable=True)
    profile_pic_url = db.Column(db.String(500), nullable=True)
    motto = db.Column(db.String(500), nullable=False)  # Store the encrypted motto


if __name__ == '__main__':
    app = create_app()
    app.run(port=3002, debug=True, threaded=True)
