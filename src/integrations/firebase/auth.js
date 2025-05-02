// src/auth.js
import { firebaseApp } from './initialize';
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

const auth = getAuth(firebaseApp);

// Google Provider
const googleProvider = new GoogleAuthProvider();

// GitHub Provider
const githubProvider = new GithubAuthProvider();

// Google Sign-In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    const user = result.user;
    const token = await user.getIdToken();

    console.log("Google User:", user);
    console.log("Google ID Token:", token);

    return { user, token };
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    return null;
  }
};

// GitHub Sign-In
export const signInWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    const token = await user.getIdToken();

    console.log("GitHub User:", user);
    console.log("GitHub ID Token:", token);

    return { user, token };
  } catch (error) {
    console.error("GitHub Sign-In Error:", error);
    return null;
  }
};