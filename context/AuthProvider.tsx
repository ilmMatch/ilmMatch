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

interface UserDataProfileType {
  userName: string;
  mobileNumber: number | null;
  waliName: string;
  waliMobileNumber: number | null;
  dob: Date;
  gender: string;
}

interface UserDataPrivateType {
  firstName: string;
  lastName: string;
  mobileNumber: number | null;
  waliMobileNumber: number | null;
  email: Date;
}

interface AuthContextType {
  currentUser: User | null;
  userDataPrivate: DocumentData | null;
  userDataProfile: DocumentData | null;
  setUserDataPrivate: (data: DocumentData | null) => void;
  setUserDataProfile: (data: DocumentData | null) => void;
  signup: (
    email: string,
    password: string,
    userName: string,
    gender: string
  ) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  forgetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  roleManager: (userId: string, role: string) => Promise<void>;
  userProfileUpdate: (userProfileNew: UserDataProfileType) => Promise<void>;
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
  const [userDataPrivate, setUserDataPrivate] = useState<DocumentData | null>(
    null
  );
  const [userDataProfile, setUserDataProfile] = useState<DocumentData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // AUTH HANDLERS
  async function signup(
    email: string,
    password: string,
    userName: string,
    gender: string
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
      const userRefP = doc(db, 'usersprofile', userId);
      const userData = {
        userName,
        gender,
        role: 'user',
        email,
        timestamp: new Date().toISOString(),
      };
      const userDataP = {
        userName,
        gender,
        timestamp: new Date().toISOString(),
      };
      await setDoc(userRef, userData);
      await setDoc(userRefP, userDataP);
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
    setUserDataPrivate(null);
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

  async function userProfileUpdate(UserProfileNew: UserDataProfileType) {
    try {
      if (!currentUser) throw 'You must be logged in';
      const userId = currentUser.uid;
      const userRef = doc(db, 'usersprofile', userId);

      const UserProfileInfo = userDataProfile as UserDataProfileType;
      // Compare fields and construct the object with updated fields
      const updates: Partial<UserDataProfileType> = {};

      for (const key in UserProfileNew) {
        const newValue = UserProfileNew[key as keyof UserDataProfileType];
        const currentValue = UserProfileInfo[key as keyof UserDataProfileType];

        if (newValue !== currentValue) {
          updates[key as keyof UserDataProfileType] = newValue as
            | undefined
            | any;
        }
      }

      // If there are no updates, return early
      if (Object.keys(updates).length === 0) {
        console.log('No updates to apply');
        return;
      }

      // Update only the changed fields in Firestore
      await updateDoc(userRef, updates);

      console.log('User profile updated successfully');
    } catch (error) {
      console.error('Error during profile update:', error);
      throw error;
    }
  }

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
          firebaseData = docSnap.data();
        }
        setUserDataPrivate(firebaseData);

        const docRefP = doc(db, 'usersprofile', user.uid);
        const docSnapP = await getDoc(docRefP);
        let firebaseDataP = {};
        if (docSnapP.exists()) {
          firebaseDataP = docSnapP.data();
        }
        setUserDataProfile(firebaseDataP);
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
    userDataPrivate,
    userDataProfile,
    setUserDataPrivate,
    setUserDataProfile,
    signup,
    logout,
    forgetPassword,
    login,
    roleManager,
    userProfileUpdate,
    loading,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
