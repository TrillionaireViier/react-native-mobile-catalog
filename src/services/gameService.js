import { db } from '../firebase/config';
import { collection, getDocs, addDoc, doc, updateDoc, increment, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { GAMES_DATA } from '../data/games';

const GAMES_COLLECTION = 'games';
const REVIEWS_COLLECTION = 'reviews';

// Fetch games from Firestore with fallback to local static data
export async function fetchCatalogGames() {
  try {
    const querySnapshot = await getDocs(collection(db, GAMES_COLLECTION));
    if (!querySnapshot.empty) {
      const firestoreGames = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return firestoreGames;
    }
  } catch (error) {
    console.warn("Firestore fetch offline or uninitialized, using catalog default dataset:", error.message);
  }
  return GAMES_DATA;
}

// Save a new user submitted game to Firestore
export async function submitNewGameToFirestore(gameData) {
  try {
    const docRef = await addDoc(collection(db, GAMES_COLLECTION), {
      ...gameData,
      createdAt: serverTimestamp()
    });
    return { ...gameData, id: docRef.id };
  } catch (error) {
    console.error("Error submitting game to Firestore:", error);
    return gameData;
  }
}

// Post a review to Firestore
export async function addReviewToFirestore(gameId, reviewData) {
  try {
    await addDoc(collection(db, REVIEWS_COLLECTION), {
      gameId,
      ...reviewData,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving review to Firestore:", error);
  }
}
