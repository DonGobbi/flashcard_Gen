import config from '../config';

export default class AuthService {
  static TOKEN_KEY = 'flashcard_auth_token';

  static async login(email, password) {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem(AuthService.TOKEN_KEY, data.token);
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async register(email, password) {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      const data = await response.json();
      localStorage.setItem(AuthService.TOKEN_KEY, data.token);
      return data;
    } catch (error) {
      throw error;
    }
  }

  static logout() {
    localStorage.removeItem(AuthService.TOKEN_KEY);
  }

  static getToken() {
    return localStorage.getItem(AuthService.TOKEN_KEY);
  }

  static isAuthenticated() {
    return !!this.getToken();
  }

  static getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
