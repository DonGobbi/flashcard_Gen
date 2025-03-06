import os
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from typing import Dict, Optional

class AuthService:
    def __init__(self):
        self.secret_key = os.getenv('JWT_SECRET_KEY', 'your-secret-key')  # In production, always use environment variable
        self._users = {}  # In production, use a proper database

    def register_user(self, email: str, password: str) -> Dict:
        """Register a new user."""
        if email in self._users:
            raise ValueError("Email already registered")

        hashed_password = generate_password_hash(password)
        self._users[email] = {
            'password': hashed_password,
            'created_at': datetime.utcnow()
        }

        return self._create_user_response(email)

    def login_user(self, email: str, password: str) -> Dict:
        """Authenticate a user and return a token."""
        user = self._users.get(email)
        if not user or not check_password_hash(user['password'], password):
            raise ValueError("Invalid email or password")

        return self._create_user_response(email)

    def verify_token(self, token: str) -> Optional[str]:
        """Verify a JWT token and return the user email."""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            return payload.get('email')
        except jwt.InvalidTokenError:
            return None

    def _create_user_response(self, email: str) -> Dict:
        """Create a response with token for the user."""
        token = jwt.encode(
            {
                'email': email,
                'exp': datetime.utcnow() + timedelta(days=1)
            },
            self.secret_key,
            algorithm='HS256'
        )

        return {
            'email': email,
            'token': token
        }
