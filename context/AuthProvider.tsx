'use client';
import { auth, db } from '@/firebase';
import { Action } from '@/types';
import {
  FetchUserProfilesResult,
  RequestAction,
  RequestCollection,
  UserProfile,
} from '@/types/firebase';
import { set } from 'date-fns';
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
  arrayRemove,
  arrayUnion,
  collection,
  deleteField,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
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
  getProfiles: (
    limitx: number,
    aprroved: string
  ) => Promise<FetchUserProfilesResult>;
  allProfiles: UserProfile[];
  bookmarkUpdate: (
    bookmarkUID: string,
    action: 'add' | 'remove'
  ) => Promise<void>;
  profileRequestUpdate: (
    userUID: string,
    action: 'add' | 'remove'
  ) => Promise<void>;
  requestsUpdate: (
    requestedof: string,
    requestedby: string,
    state: RequestAction,
    action: Action
  ) => Promise<void>;
  getProfilebyUID: (uid: string) => Promise<DocumentData>;
  getProfilebyUIDs: (uids: string[]) => Promise<FetchUserProfilesResult>;
  getRequestedMe: (uid: string) => Promise<RequestCollection>;
  getMyRequested: (uid: string) => Promise<RequestCollection>;
  getAllAccepted: () => Promise<[string, string][]>;
  setMatchAdmin: (profile1: string, profile2: string) => Promise<void>;
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
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>([]);
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

  async function approvalUpdate(status: string, uid: string) {
    try {
      const userRef = doc(db, 'usersprofile', uid);
      await updateDoc(userRef, { approved: status });

      console.log('User profile updated successfully');
      return;
    } catch (error) {
      console.error('Error during updation:', error);
      throw error;
    }
  }

  async function getProfiles(
    limitx: number = 10,
    aprroved: string = 'approved'
  ) {
    try {
      // Create a reference to the usersprofile collection
      const usersProfileRef = collection(db, 'usersprofile');

      // Create a query to fetch only approved profiles
      const q = query(
        usersProfileRef,
        where('approved', '==', aprroved), //possible values = approved | notApproved | requested
        limit(limitx)
      );

      // Execute the query
      const querySnapshot = await getDocs(q);

      // Map the documents to an array of data
      const userProfiles: UserProfile[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<UserProfile, 'id'>),
      }));
      console.log('userProfiles', userProfiles);
      setAllProfiles(userProfiles);
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

  async function bookmarkUpdate(bookmarkUID: string, action: 'add' | 'remove') {
    try {
      if (!currentUser) throw 'You must be logged in';
      const userRef = doc(db, 'users', currentUser.uid);
      if (action === 'add') {
        await updateDoc(userRef, { bookmarks: arrayUnion(bookmarkUID) });
      } else if (action === 'remove') {
        await updateDoc(userRef, { bookmarks: arrayRemove(bookmarkUID) });
      }
      return;
    } catch (error) {
      console.error('Error during bookmark:', error);
      throw error;
    }
  }

  async function profileRequestUpdate(
    userUID: string,
    action: 'add' | 'remove'
  ) {
    try {
      if (!currentUser) throw 'You must be logged in';
      const userRef = doc(db, 'users', currentUser.uid);
      if (action === 'add') {
        await updateDoc(userRef, { requested: arrayUnion(userUID) });
      } else if (action === 'remove') {
        await updateDoc(userRef, { requested: arrayRemove(userUID) });
      }
      return;
    } catch (error) {
      console.error('Error during bookmark:', error);
      throw error;
    }
  }

  async function requestsUpdate(
    requestedof: string,
    requestedby: string,
    state: RequestAction,
    action: Action
  ) {
    // adds the current user to the requestedby document of the requestuser
    // requested user.ID { requestedby.UID: accepted | rejected | requested, requestedby.UID: accepted | rejected | requested, ... }
    try {
      if (!currentUser) throw 'You must be logged in';
      // requestedby: field that needs to be updated
      // requestedof: document Id
      const requestedme = doc(db, 'requestedme', requestedof);
      const myrequested = doc(db, 'myrequested', requestedby);
      if (state === 'unmatched') {
        const docRef1 = doc(db, 'users', requestedof);
        const docRef2 = doc(db, 'users', requestedby);
        await setDoc(
          docRef1,
          {
            unmatched: arrayUnion(requestedby),
            matched: arrayRemove(requestedby),
          },
          { merge: true }
        );
        await setDoc(
          docRef2,
          {
            unmatched: arrayUnion(requestedof),
            matched: arrayRemove(requestedof),
          },
          { merge: true }
        );
      } else if (action === 'add') {
        await setDoc(requestedme, { [requestedby]: state }, { merge: true });
        await setDoc(myrequested, { [requestedof]: state }, { merge: true });
      } else if (action === 'remove') {
        await updateDoc(requestedme, { [requestedby]: deleteField() });
        await updateDoc(myrequested, { [requestedof]: deleteField() });
      }
    } catch (error) {
      console.error('Error Requesting:', error);
      throw error;
    }
  }

  async function getProfilebyUIDs(uids: string[]) {
    try {
      const usersProfileRef = collection(db, 'usersprofile');
      const q = query(usersProfileRef, where('__name__', 'in', uids));
      // Fetch the documents
      const querySnapshot = await getDocs(q);

      // Process the results
      const profiles: UserProfile[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<UserProfile, 'id'>),
      }));

      return {
        success: true,
        profiles: profiles,
      };
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async function getProfilebyUID(uid: string) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      let firebaseData = {};
      if (docSnap.exists()) {
        firebaseData = docSnap.data();
      }
      return firebaseData;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async function getRequestedMe(uid: string) {
    try {
      if (!currentUser) throw 'You must be logged in';
      // requestedby: field that needs to be updated
      // requestedof: document Id
      const userRef = doc(db, 'requestedme', uid);

      const docSnap = await getDoc(userRef);
      let firebaseData = {};
      if (docSnap.exists()) {
        firebaseData = docSnap.data();
      }
      return firebaseData;
    } catch (error) {
      console.error('Error Requesting:', error);
      throw error;
    }
  }

  async function getMyRequested(uid: string) {
    try {
      if (!currentUser) throw 'You must be logged in';
      // requestedby: field that needs to be updated
      // requestedof: document Id
      const userRef = doc(db, 'myrequested', uid);

      const docSnap = await getDoc(userRef);
      let firebaseData = {};
      if (docSnap.exists()) {
        firebaseData = docSnap.data();
      }
      return firebaseData;
    } catch (error) {
      console.error('Error Requesting:', error);
      throw error;
    }
  }

  async function getAllAccepted() {
    const myRequestCollection = collection(db, 'myrequested');
    const querySnapshot = await getDocs(myRequestCollection);

    const result: [string, string][] = [];

    querySnapshot.forEach((doc) => {
      const docId = doc.id;
      const data = doc.data();

      for (const [uid, status] of Object.entries(data)) {
        if (status === 'accepted') {
          result.push([docId, uid]);
        }
      }
    });

    console.log(result, 'result');
    return result;
  }

  async function setMatchAdmin(profile1: string, profile2: string) {
    const docRef1 = doc(db, 'users', profile1);
    const docRef2 = doc(db, 'users', profile2);
    await setDoc(
      docRef1,
      { 'matched.true': arrayUnion(profile2) },
      { merge: true }
    );
    await setDoc(
      docRef2,
      { 'matched.true': arrayUnion(profile1) },
      { merge: true }
    );

    const requestedme1 = doc(db, 'requestedme', profile1);
    const myrequested1 = doc(db, 'myrequested', profile1);
    const requestedme2 = doc(db, 'requestedme', profile2);
    const myrequested2 = doc(db, 'myrequested', profile2);

    if (requestedme1) {
      await updateDoc(requestedme1, { [profile2]: deleteField() });
    }
    if (myrequested1) {
      await updateDoc(myrequested1, { [profile2]: deleteField() });
    }
    if (requestedme2) {
      await updateDoc(requestedme2, { [profile1]: deleteField() });
    }
    if (myrequested2) {
      await updateDoc(myrequested2, { [profile1]: deleteField() });
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
    allProfiles,
    bookmarkUpdate,
    profileRequestUpdate,
    requestsUpdate,
    getProfilebyUIDs,
    getProfilebyUID,
    getRequestedMe,
    getMyRequested,
    getAllAccepted,
    setMatchAdmin,
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
