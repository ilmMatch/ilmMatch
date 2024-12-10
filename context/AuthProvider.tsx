'use client';
import { auth, db } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from 'firebase/auth';
import {
  doc,
  DocumentData,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { useContext, useState, useEffect, createContext } from 'react';

interface AuthContextType {
  currentUser: User | null;
  userDataObj: DocumentData | null;
  setUserDataObj: (data: DocumentData | null) => void;
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  forgetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  roleManager: (userId: string, role: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider(props: { children: React.ReactNode }) {
  const { children } = props;
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userDataObj, setUserDataObj] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  // AUTH HANDLERS
  async function signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Step 2: Get the user ID (UID)
      const user = userCredential.user;
      const userId = user.uid;
      const userRef = doc(db, 'users', userId);
      const userData = {
        firstName,
        lastName,
        role: 'user',
        email,
        timestamp: new Date().toISOString(),
      };
      await setDoc(userRef, userData);
      return userCredential;
    } catch (error) {
      console.error('Error during sign-up:', error);
      throw error; // Re-throw or handle as per your app's needs
    }
  }

  async function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function forgetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  }

  async function logout() {
    setUserDataObj(null);
    setCurrentUser(null);
    return signOut(auth);
  }

  const roleManager = async (userId: string, role: string) => {
    if (!userId || !role || !currentUser) {
      alert('Please provide both User ID and Role.');
      return;
    }
    console.log('currentuser', currentUser);
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, {
        role,
        assignedBy: currentUser.uid,
        assignedAt: new Date().toISOString(),
      });
      alert(`Role '${role}' assigned to user '${userId}'`);
    } catch (err: any) {
      console.error('Error assigning role:', err.message);
      alert('Failed to assign role.');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        // Set the user to our local context state
        setLoading(true);
        setCurrentUser(user);
        if (!user) {
          console.log('No User Found');
          return;
        }
        // if user exists, fetch data from firestore database
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        let firebaseData = {};
        if (docSnap.exists()) {
          console.log('Found User Data');
          firebaseData = docSnap.data();
        }
        console.log('firebaseData', firebaseData);
        setUserDataObj(firebaseData);
      } catch (err: any) {
        console.error('Error fetching user data:', err.message);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const values: AuthContextType = {
    currentUser,
    userDataObj,
    setUserDataObj,
    signup,
    logout,
    forgetPassword,
    login,
    roleManager,
    loading,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
