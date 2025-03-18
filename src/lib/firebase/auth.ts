import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from './config';

/**
 * Create a new user with email and password
 */
export const createUser = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Add display name to the user
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential.user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Sign in a user with email and password
 */
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/**
 * Reset a user's password
 */
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

/**
 * Get the current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};