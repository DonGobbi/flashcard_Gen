import AuthService from './authService';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  static async generateFromYoutube(url, numCards = 5) {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const response = await fetch(`${API_BASE_URL}/youtube`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeaders(),
        },
        body: JSON.stringify({ url, num_cards: numCards }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate flashcards');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating flashcards from YouTube:', error);
      throw error;
    }
  }

  static async generateFromFile(file, numCards = 5) {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('num_cards', numCards);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          ...AuthService.getAuthHeaders(),
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate flashcards');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating flashcards from file:', error);
      throw error;
    }
  }
}

export default ApiService;
