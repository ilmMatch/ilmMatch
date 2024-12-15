'use client';
import { auth, db } from '@/firebase';
import { getInitials, getObjectDiff } from '@/lib/utils';
import { Action } from '@/types';
import {
  AuthContextType,
  FetchUserProfilesResult,
  PairResult,
  ProfileResult,
  RequestAction,
  UserDataPrivateType,
  UserProfile,
  VoidResult,
} from '@/types/firebase';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import {
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
  WriteBatch,
  writeBatch,
} from 'firebase/firestore';
import { useContext, useState, useEffect, createContext } from 'react';




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
  async function signup(email: string, password: string, userName: string, gender: string): Promise<VoidResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      const userId = user.uid;
      const userRef = doc(db, 'users', userId);
      const userRefP = doc(db, 'usersprofile', userId);
      const timestamp = new Date().toISOString();
      const userData = {
        userName,
        gender,
        role: 'user',
        email,
        timestamp,
      };
      const userDataP = {
        initials: getInitials(userName),
        gender,
        timestamp,
        approved: 'not approved',
      };
      await Promise.all([setDoc(userRef, userData), setDoc(userRefP, userDataP)]);

      return { success: true };
    } catch (error: any) {
      console.error('Error during signup:', error.message);
      return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
  }


  async function login(email: string, password: string): Promise<VoidResult> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      console.error('Error during login:', error.message);
      return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
  }



  async function forgetPassword(email: string): Promise<VoidResult> {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      console.error('Error during password reset:', error.message);
      return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
  }


  async function logout(): Promise<VoidResult> {
    try {
      await signOut(auth);
      setUserDataPrivate(null);
      setCurrentUser(null);
      return { success: true };
    } catch (error: any) {
      console.error('Error during logout:', error.message);
      return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
  }

  const roleManager = async (userId: string, role: string): Promise<VoidResult> => {
    if (!userId || !role || !currentUser) {
      return { success: false, error: "Please provide User ID and Role." };
    }
    console.log('currentuser', currentUser);
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, {
        role,
        assignedBy: currentUser.uid,
        assignedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error: any) {
      console.error('Error assigning role:', error.message);
      return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
  };

  async function userPrivateUpdate(UserProfileNew: UserDataPrivateType): Promise<VoidResult> {
    try {
      if (!currentUser || !userDataPrivate) return { success: false, error: "Please provide User Details." };
      const userId = currentUser.uid;
      const userRef = doc(db, 'users', userId);
      const userRefP = doc(db, 'usersprofile', userId);

      const UserProfileInfo = userDataPrivate as UserDataPrivateType;
      UserProfileInfo.dob = new Date(userDataPrivate.dob?.seconds * 1000);
      const updates = getObjectDiff(userDataPrivate, UserProfileNew);

      if (Object.keys(updates).length === 0) {
        return { success: false, error: "No changes to apply." };
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

      return { success: true };
    } catch (error: any) {
      console.error('Error during profile update:', error.message);
      return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
  }

  async function approvalUpdate(status: string, uid: string): Promise<VoidResult> {
    try {
      const userRef = doc(db, 'usersprofile', uid);
      await updateDoc(userRef, { approved: status });
      return { success: true };
    } catch (error: any) {
      console.error('Error during updation:', error.message);
      return {
        success: false, error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

  async function getProfiles(limitx: number = 10, aprroved: string = 'approved'): Promise<FetchUserProfilesResult> {
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

  async function bookmarkUpdate(bookmarkUID: string, action: 'add' | 'remove'): Promise<VoidResult> {
    try {
      if (!currentUser) throw 'You must be logged in';
      const userRef = doc(db, 'users', currentUser.uid);
      if (action === 'add') {
        await updateDoc(userRef, { bookmarks: arrayUnion(bookmarkUID) });
      } else if (action === 'remove') {
        await updateDoc(userRef, { bookmarks: arrayRemove(bookmarkUID) });
      }
      return { success: true };
    } catch (error: any) {
      console.error('Error during bookmark:', error.message);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async function profileRequestUpdate(userUID: string, action: 'add' | 'remove'): Promise<VoidResult> {
    try {
      if (!currentUser) throw 'You must be logged in';
      const userRef = doc(db, 'users', currentUser.uid);
      if (action === 'add') {
        await updateDoc(userRef, { requested: arrayUnion(userUID) });
      } else if (action === 'remove') {
        await updateDoc(userRef, { requested: arrayRemove(userUID) });
      }
      return { success: true };
    } catch (error: any) {
      console.error('Error during bookmark:', error.message);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async function requestsUpdate(requestedof: string, requestedby: string, state: RequestAction, action: Action): Promise<VoidResult> {
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
      return { success: true };
    } catch (error: any) {
      console.error('Error Requesting:', error.message);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async function getProfilebyUIDs(uids: string[]): Promise<FetchUserProfilesResult> {
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

  async function getProfilebyUID(uid: string): Promise<DocumentData> {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      let firebaseData = {};
      if (docSnap.exists()) {
        firebaseData = docSnap.data();
      }
      return { success: true, data: firebaseData, };
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async function getRequestedMe(uid: string): Promise<DocumentData> {
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
      return { success: true, data: firebaseData }
    } catch (error: any) {
      console.error('Error Requesting:', error.message);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async function getMyRequested(uid: string): Promise<DocumentData> {
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
      return { success: true, data: firebaseData };
    } catch (error: any) {
      console.error('Error Requesting:', error.message);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async function getAllAccepted(): Promise<PairResult> {
    try {


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


      return { success: true, data: result }
    } catch (error: any) {
      console.error('Error Requesting:', error.message);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }


  async function setMatchAdmin(profile1: string, profile2: string): Promise<VoidResult> {
    const updateMatchedDocs = (batch: WriteBatch) => {
      const docRef1 = doc(db, 'users', profile1);
      const docRef2 = doc(db, 'users', profile2);

      batch.set(
        docRef1,
        { 'matched.true': arrayUnion(profile2) },
        { merge: true }
      );
      batch.set(
        docRef2,
        { 'matched.true': arrayUnion(profile1) },
        { merge: true }
      );
    };

    const removeRequests = async (batch: WriteBatch) => {
      const documentsToCheck = [
        { ref: doc(db, 'requestedme', profile1), field: profile2 },
        { ref: doc(db, 'myrequested', profile1), field: profile2 },
        { ref: doc(db, 'requestedme', profile2), field: profile1 },
        { ref: doc(db, 'myrequested', profile2), field: profile1 },
      ];

      for (const { ref, field } of documentsToCheck) {
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          batch.update(ref, { [field]: deleteField() });
        } else {
          console.warn(`Document ${ref.path} does not exist, skipping update.`);
        }
      }
    };

    try {
      const batch = writeBatch(db);

      updateMatchedDocs(batch);
      await removeRequests(batch);

      await batch.commit();

      return { success: true };
    } catch (error: unknown) {
      console.error('Error in setMatchAdmin:', error instanceof Error ? error.message : error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
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
    allProfiles,
    loading,
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
    bookmarkUpdate,
    profileRequestUpdate,
    requestsUpdate,
    getProfilebyUIDs,
    getProfilebyUID,
    getRequestedMe,
    getMyRequested,
    getAllAccepted,
    setMatchAdmin,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

