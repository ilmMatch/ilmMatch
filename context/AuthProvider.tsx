'use client';
import { auth, db } from '@/firebase';
import { FetchUserProfilesResult, UserProfile } from '@/types/firebase';
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
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useContext, useState, useEffect, createContext } from 'react';

interface UserDataPrivateType {
  userName: string;
  mobileNumber: number | null;
  waliName: string;
  waliMobileNumber: number | null;
  dob: Date;
  gender: string;
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
  userPrivateUpdate: (userProfileNew: UserDataPrivateType) => Promise<void>;
  approvalUpdate: (data: string, uid: string) => Promise<void>;
  getProfiles: () => Promise<FetchUserProfilesResult>;
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
        initials: getInitials(userName),
        gender,
        timestamp: new Date().toISOString(),
        approved: 'not approved',
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

  async function userPrivateUpdate(UserProfileNew: UserDataPrivateType) {
    try {
      if (!currentUser || !userDataPrivate) throw 'You must be logged in';
      const userId = currentUser.uid;
      const userRef = doc(db, 'users', userId);
      const userRefP = doc(db, 'usersprofile', userId);

      const UserProfileInfo = userDataPrivate as UserDataPrivateType;
      UserProfileInfo.dob = new Date(userDataPrivate.dob?.seconds * 1000);
      const updates = getObjectDiff(userDataPrivate, UserProfileNew);

      if (Object.keys(updates).length === 0) {
        console.log('No updates to apply');
        return;
      }

      await updateDoc(userRef, updates);

      if (updates.userName || updates.dob) {
        const updateData: Record<string, any> = {};

        if (updates.userName) {
          updateData.initials = getInitials(updates.userName);
        }
        if (updates.dob) {
          updateData.dob = updates.dob;
        }

        await updateDoc(userRefP, updateData);
      }

      console.log('User profile updated successfully');
    } catch (error) {
      console.error('Error during profile update:', error);
      throw error;
    }
  }

  async function approvalUpdate(data: string, uid: string) {
    try {
      const userRef = doc(db, 'usersprofile', uid);
      await updateDoc(userRef, { approved: data });

      console.log('User profile updated successfully');
      return;
    } catch (error) {
      console.error('Error during updation:', error);
      throw error;
    }
  }

  async function getProfiles() {
    try {
      // Create a reference to the usersprofile collection
      const usersProfileRef = collection(db, 'usersprofile');

      // Create a query to fetch only approved profiles
      const q = query(
        usersProfileRef,
        where('approved', 'not-in', ['requested', 'not approved'])
      );

      // Execute the query
      const querySnapshot = await getDocs(q);

      // Map the documents to an array of data
      const userProfiles: UserProfile[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<UserProfile, 'id'>),
      }));
      console.log('userProfiles', userProfiles);

      return {
        success: true,
        profiles: userProfiles,
      };
    } catch (error: any) {
      console.error('Error fetching user profiles:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
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
    userPrivateUpdate,
    approvalUpdate,
    getProfiles,
    loading,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

// *********************************************************************************
// This function calculates the difference between two objects(oldData and newData)
// and returns a new object containing only the keys that have been added or modified.
function getObjectDiff<T extends Record<string, any>>(
  oldData: T,
  newData: T
): Partial<T> {
  const diff: Partial<T> = {};

  // Iterate through all keys in the new data
  for (const key in newData) {
    // Check if the key doesn't exist in old data or the value has changed
    if (
      !(key in oldData) || // New key
      JSON.stringify(oldData[key]) !== JSON.stringify(newData[key]) // Value changed
    ) {
      diff[key] = newData[key];
    }
  }

  return diff;
}

function getInitials(fullName: string): string {
  const nameParts = fullName.split(' ');

  const initials = nameParts
    .map((part) => part.charAt(0).toUpperCase())
    .join('.');

  return initials;
}
