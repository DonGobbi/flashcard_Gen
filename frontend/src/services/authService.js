import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase';

class AuthService {
  static async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        user: userCredential.user,
        token: await userCredential.user.getIdToken()
      };
    } catch (error) {
      throw this._handleFirebaseError(error);
    }
  }

  static async register(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return {
        user: userCredential.user,
        token: await userCredential.user.getIdToken()
      };
    } catch (error) {
      throw this._handleFirebaseError(error);
    }
  }

  static async logout() {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  static onAuthStateChange(callback) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then(token => {
          const userData = {
            uid: user.uid,
            email: user.email,
            token
          };
          localStorage.setItem('user', JSON.stringify(userData));
          callback(userData);
        });
      } else {
        localStorage.removeItem('user');
        callback(null);
      }
    });
  }

  static getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static isAuthenticated() {
    return !!this.getCurrentUser();
  }

  static getAuthHeaders() {
    const user = this.getCurrentUser();
    return user ? { Authorization: `Bearer ${user.token}` } : {};
  }

  static _handleFirebaseError(error) {
    let message = 'An error occurred during authentication';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'This email is already registered';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        message = 'Invalid email or password';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later';
        break;
      default:
        console.error('Firebase auth error:', error);
    }

    return new Error(message);
  }
}

export default AuthService;
