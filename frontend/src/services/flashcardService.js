import { 
  collection, 
  addDoc, 
  getDocs,
  getDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  increment,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import AuthService from './authService';

class FlashcardService {
  static async saveFlashcards(flashcards, setInfo = {}) {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // Create a new flashcard set
      const setRef = await addDoc(collection(db, 'flashcard_sets'), {
        userId: user.uid,
        title: setInfo.title || 'Untitled Set',
        description: setInfo.description || '',
        style: setInfo.style || 'modern',
        created: serverTimestamp(),
        lastModified: serverTimestamp(),
        cardCount: flashcards.length,
        stats: {
          timesStudied: 0,
          averageScore: 0,
          lastStudied: null
        }
      });

      // Create all flashcards in a batch
      const batch = writeBatch(db);
      flashcards.forEach((card) => {
        const cardRef = doc(collection(db, 'flashcards'));
        batch.set(cardRef, {
          setId: setRef.id,
          userId: user.uid,
          question: card.question,
          answer: card.answer,
          created: serverTimestamp(),
          lastModified: serverTimestamp(),
          customization: card.customization || {},
          stats: {
            timesReviewed: 0,
            correctCount: 0,
            incorrectCount: 0,
            lastReviewed: null
          }
        });
      });

      await batch.commit();
      return { setId: setRef.id };
    } catch (error) {
      console.error('Error saving flashcards:', error);
      throw error;
    }
  }

  static async getUserFlashcardSets() {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const q = query(
        collection(db, 'flashcard_sets'),
        where('userId', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching flashcard sets:', error);
      throw error;
    }
  }

  static async getFlashcardsInSet(setId) {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const q = query(
        collection(db, 'flashcards'),
        where('setId', '==', setId),
        where('userId', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      throw error;
    }
  }

  static async updateFlashcardSet(setId, updates) {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const setRef = doc(db, 'flashcard_sets', setId);
      await updateDoc(setRef, {
        ...updates,
        lastModified: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating flashcard set:', error);
      throw error;
    }
  }

  static async deleteFlashcardSet(setId) {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // Delete all flashcards in the set
      const cardsQuery = query(
        collection(db, 'flashcards'),
        where('setId', '==', setId)
      );
      const cardSnapshot = await getDocs(cardsQuery);

      const batch = writeBatch(db);
      cardSnapshot.docs.forEach((cardDoc) => {
        batch.delete(cardDoc.ref);
      });

      // Delete the set itself
      batch.delete(doc(db, 'flashcard_sets', setId));
      await batch.commit();
    } catch (error) {
      console.error('Error deleting flashcard set:', error);
      throw error;
    }
  }

  static async updateFlashcard(id, updates) {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const docRef = doc(db, 'flashcards', id);
      await updateDoc(docRef, {
        ...updates,
        lastModified: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating flashcard:', error);
      throw error;
    }
  }

  static async updateFlashcardStats(id, isCorrect) {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const docRef = doc(db, 'flashcards', id);
      await updateDoc(docRef, {
        'stats.timesReviewed': increment(1),
        'stats.lastReviewed': serverTimestamp(),
        [`stats.${isCorrect ? 'correctCount' : 'incorrectCount'}`]: increment(1)
      });

      // Update set statistics
      const card = await getDoc(docRef);
      const setRef = doc(db, 'flashcard_sets', card.data().setId);
      await updateDoc(setRef, {
        'stats.timesStudied': increment(1),
        'stats.lastStudied': serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating flashcard stats:', error);
      throw error;
    }
  }

  static async saveCustomization(customization) {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        customization: {
          ...customization,
          lastModified: serverTimestamp()
        }
      });
    } catch (error) {
      console.error('Error saving customization:', error);
      throw error;
    }
  }

  static async getCustomization() {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      return userDoc.data()?.customization || {};
    } catch (error) {
      console.error('Error fetching customization:', error);
      throw error;
    }
  }
}

export default FlashcardService;
