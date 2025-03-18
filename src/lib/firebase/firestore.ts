import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  Timestamp,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

/**
 * Create a document with a specific ID
 */
export const createDocumentWithId = async (
  collectionName: string,
  id: string,
  data: DocumentData
) => {
  try {
    const docRef = doc(db, collectionName, id);
    // Add created and updated timestamps
    const dataWithTimestamps = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(docRef, dataWithTimestamps);
    return { id, ...data };
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Create a document with auto-generated ID
 */
export const createDocument = async (
  collectionName: string,
  data: DocumentData
) => {
  try {
    const collectionRef = collection(db, collectionName);
    // Add created and updated timestamps
    const dataWithTimestamps = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(collectionRef, dataWithTimestamps);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get a document by ID
 */
export const getDocument = async (
  collectionName: string,
  id: string
) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Update a document
 */
export const updateDocument = async (
  collectionName: string,
  id: string,
  data: DocumentData
) => {
  try {
    const docRef = doc(db, collectionName, id);
    // Add updated timestamp
    const dataWithTimestamp = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(docRef, dataWithTimestamp);
    return { id, ...data };
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Delete a document
 */
export const deleteDocument = async (
  collectionName: string,
  id: string
) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Query documents from a collection
 */
export const queryDocuments = async (
  collectionName: string,
  constraints: QueryConstraint[] = []
) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    const documents: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return documents;
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get all documents from a collection
 */
export const getAllDocuments = async (collectionName: string) => {
  return queryDocuments(collectionName);
};

/**
 * Helper to convert Firestore Timestamp to Date
 */
export const timestampToDate = (timestamp: Timestamp) => {
  return timestamp.toDate();
};