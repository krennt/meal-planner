import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

/**
 * Test function to directly verify Firestore connectivity
 * Call this from the browser console to debug Firestore issues
 */
export const testFirestoreConnection = async () => {
  try {
    console.log('Testing Firestore connection...');
    
    // Try to read from a test collection
    const testCollectionRef = collection(db, 'test_collection');
    console.log('Reading from test collection...');
    const snapshot = await getDocs(testCollectionRef);
    
    console.log(`Successfully read ${snapshot.docs.length} documents from test collection`);
    
    // Try to write to the test collection
    console.log('Writing test document to Firestore...');
    const testDoc = {
      message: 'Test document',
      timestamp: serverTimestamp()
    };
    
    const docRef = await addDoc(testCollectionRef, testDoc);
    console.log(`Successfully wrote test document with ID: ${docRef.id}`);
    
    return {
      success: true,
      readCount: snapshot.docs.length,
      writeId: docRef.id
    };
  } catch (error) {
    console.error('Error testing Firestore connection:', error);
    return {
      success: false,
      error: error
    };
  }
};

// Expose the function to the window object for debugging
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.testFirestore = testFirestoreConnection;
}
