import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile
} from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import auth from '../../firebase.inti';

const GoogleProvider = new GoogleAuthProvider();

// Context তৈরি
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // নতুন ইউজার তৈরি
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // সাইন ইন
  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  // google সাইন ইন
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, GoogleProvider);
  };

  // update user profile
  const updateUserProfile = (ProfileInfo) => {
    return updateProfile(auth.currentUser, ProfileInfo);
  }

  // লগআউট
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // ইউজার অবজার্ভ করা
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // সবকিছু context এ পাঠানো
  const authData = {
    user,
    loading,
    createUser,
    signInUser,
    logOut,
    setUser,
    signInWithGoogle,
    updateUserProfile
  };

  return (
    <AuthContext value={authData}>
      {children}
    </AuthContext>
  );
};

export default AuthProvider;
