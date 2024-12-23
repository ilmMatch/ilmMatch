'use client';
import { auth, db } from '@/firebase';
import { getFilterConditions } from '@/lib/filterConditions';
import { getInitials, getObjectDiff } from '@/lib/utils';
import { Action } from '@/types';
import {
  AuthContextType,
  FetchUserPrivatesResult,
  FetchUserProfilesResult,
  FilterOptions,
  PairResult,
  ProfileResult,
  RequestAction,
  RequestCollection,
  SinglePrivateResult,
  SingleProfileResult,
  UserDataPrivateType,
  UserDataProfileType,
  UserPrivate,
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
  and,
  arrayRemove,
  arrayUnion,
  collection,
  deleteField,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  limit,
  or,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
  startAfter,
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
  async function signup(
    email: string,
    password: string,
    userName: string,
    gender: string
  ): Promise<VoidResult> {
    try {
      // Create a new user with Firebase Authentication
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

      // Data for the `users` collection
      const userData = {
        userName,
        gender,
        role: 'user',
        email,
        timestamp,
      };

      // Data for the `usersprofile` collection
      const userDataP = {
        initials: getInitials(userName),
        gender,
        timestamp,
        approved: 'notApproved',
      };

      // Initialize Firestore batch
      const batch = writeBatch(db);

      // Add operations to the batch
      batch.set(userRef, userData);
      batch.set(userRefP, userDataP);

      // Commit the batch
      await batch.commit();

      return { success: true };
    } catch (error: any) {
      console.error('Error during signup:', error.message);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }


  async function login(email: string, password: string): Promise<VoidResult> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      console.error('Error during login:', error.message);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async function forgetPassword(email: string): Promise<VoidResult> {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      console.error('Error during password reset:', error.message);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
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
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  const roleManager = async (
    userId: string,
    role: string
  ): Promise<VoidResult> => {
    try {
      // Validate required inputs
      if (!userId || !role || !currentUser) {
        return { success: false, error: 'Please provide User ID and Role.' };
      }
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, {
        role,
        assignedBy: currentUser.uid,
        assignedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error: any) {
      console.error('Error assigning role:', error);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  };


  async function userPrivateUpdate(
    UserProfileNew: UserDataPrivateType
  ): Promise<VoidResult> {
    try {
      // Validate required data
      if (!currentUser || !userDataPrivate) {
        return { success: false, error: 'Please provide User Details.' };
      }

      const userId = currentUser.uid;
      const userRef = doc(db, 'users', userId);
      const userRefP = doc(db, 'usersprofile', userId);

      // Convert date of birth to JavaScript Date if necessary
      const UserProfileInfo = { ...userDataPrivate } as UserDataPrivateType;
      if (userDataPrivate.dob?.seconds) {
        UserProfileInfo.dob = new Date(userDataPrivate.dob.seconds * 1000);
      }

      // Calculate the differences between old and new user data
      const updates = getObjectDiff(userDataPrivate, UserProfileNew);

      if (Object.keys(updates).length === 0) {
        return { success: false, error: 'No changes to apply.' };
      }

      // Initialize Firestore batch
      const batch = writeBatch(db);

      // Update the main user document
      batch.update(userRef, updates);

      // Mark the user profile as not approved
      batch.update(userRefP, { approved: 'notApproved' });

      // Update additional profile fields if necessary
      if (updates.userName || updates.dob) {
        const updateData: Record<string, any> = {};

        if (updates.userName) {
          updateData.initials = getInitials(updates.userName);
        }
        if (updates.dob) {
          updateData.dob = updates.dob;
        }

        batch.update(userRefP, updateData);
      }

      // Commit the batch
      await batch.commit();

      return { success: true };
    } catch (error: any) {
      console.error('Error during profile update:', error.message);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async function userProfileUpdate(
    UserProfileNew: UserDataProfileType
  ): Promise<VoidResult> {
    try {
      // Validate required data
      if (!currentUser) {
        return { success: false, error: 'Please provide User Details.' };
      }

      const userId = currentUser.uid;
      const userRefP = doc(db, 'usersprofile', userId);
      await setDoc(
        userRefP,
        { ...UserProfileNew, approved: 'notApproved' },
        { merge: true }
      );


      return { success: true };
    } catch (error: any) {
      console.error('Error during profile update:', error.message);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async function approvalUpdate(
    status: string,
    uid: string
  ): Promise<VoidResult> {
    try {
      const userRef = doc(db, 'usersprofile', uid);

      // Update the 'approved' field in the document
      await updateDoc(userRef, { approved: status });

      return { success: true };
    } catch (error: any) {
      console.error('Error during approval update:', error.message);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  // async function getProfiles(
  //   limitx: number = 10,
  //   lastVisibleDoc: QueryDocumentSnapshot<DocumentData> | null = null,
  //   approved: string = 'approved',
  //   filters: FilterOptions | null = null
  // ): Promise<FetchUserProfilesResult> {
  //   try {
  //     // Create a reference to the usersprofile collection
  //     if (!currentUser) throw new Error('you must be logged in');
  //     const usersProfileRef = collection(db, 'usersprofile');

  //     // Create the query to fetch only approved profiles
  //     let q = query(
  //       usersProfileRef,
  //       where('approved', '==', approved), // approved | notApproved | requested
  //       where('__name__', '!=', currentUser.uid),
  //       orderBy('approved'),
  //       limit(limitx)
  //     );
  //     if (lastVisibleDoc) {
  //       // If we have a last visible document, start after it
  //       q = query(q, startAfter(lastVisibleDoc));
  //     }

  //     // Execute the query to get the documents
  //     const querySnapshot = await getDocs(q);

  //     // Extract user profiles from the documents
  //     const userProfiles: UserProfile[] = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...(doc.data() as Omit<UserProfile, 'id'>),
  //     }));

  //     const newLastVisibleDoc =
  //       querySnapshot.docs[querySnapshot.docs.length - 1] || null;
  //     return {
  //       success: true,
  //       data: userProfiles,
  //       lastVisibleDoc: newLastVisibleDoc,
  //     };
  //   } catch (error: any) {
  //     console.error('Error fetching user profiles:', error);
  //     return {
  //       success: false,
  //       error:
  //         error instanceof Error ? error.message : 'An unknown error occurred',
  //     };
  //   }
  // }
  async function getProfiles(
    limitx: number = 10,
    lastVisibleDoc: QueryDocumentSnapshot<DocumentData> | null = null,
    approved: string = 'approved',
    filters: FilterOptions = {}
  ): Promise<FetchUserProfilesResult> {
    try {
      // Create a reference to the usersprofile collection
      if (!currentUser) throw new Error('you must be logged in');
      const usersProfileRef = collection(db, 'usersprofile');

      // Create the query to fetch only approved profiles
      const baseConditions = [
        where('approved', '==', approved),
        where('__name__', '!=', currentUser.uid),
      ];
      const filterConditions = getFilterConditions(filters);

      let q = query(
        usersProfileRef,
        ...baseConditions,
        ...filterConditions,
        orderBy('approved'),
        limit(limitx)
      );


      if (lastVisibleDoc) {
        // If we have a last visible document, start after it
        q = query(q, startAfter(lastVisibleDoc));
      }

      // Execute the query to get the documents
      const querySnapshot = await getDocs(q);

      // Extract user profiles from the documents
      const userProfiles: UserProfile[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<UserProfile, 'id'>),
      }));

      const newLastVisibleDoc =
        querySnapshot.docs[querySnapshot.docs.length - 1] || null;
      return {
        success: true,
        data: userProfiles,
        lastVisibleDoc: newLastVisibleDoc,
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

  async function bookmarkUpdate(
    bookmarkUID: string,
    action: 'add' | 'remove'
  ): Promise<VoidResult> {
    try {
      // Ensure the user is logged in
      if (!currentUser) {
        throw new Error('You must be logged in');
      }

      const userRef = doc(db, 'users', currentUser.uid);
      const updateAction =
        action === 'add' ? arrayUnion(bookmarkUID) : arrayRemove(bookmarkUID);
      await updateDoc(userRef, { bookmarks: updateAction });
      const updateUserPrivateData = await getDoc(userRef);
      setUserDataPrivate(updateUserPrivateData.data() as UserDataPrivateType);
      return { success: true };
    } catch (error: any) {
      console.error('Error during bookmark update:', error.message);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async function profileRequestUpdate(
    userUID: string,
    action: 'add' | 'remove'
  ): Promise<VoidResult> {
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

  async function requestsUpdate(
    requestedof: string,
    requestedby: string,
    state: RequestAction,
    action: Action
  ): Promise<VoidResult> {
    try {
      // Ensure the user is logged in
      if (!currentUser) throw new Error('You must be logged in');

      // Initialize Firestore batch
      const batch = writeBatch(db);

      // References to the Firestore documents
      const requestedme = doc(db, 'requestedme', requestedof);
      const myrequested = doc(db, 'myrequested', requestedby);
      const docRef1 = doc(db, 'users', requestedof);
      const docRef2 = doc(db, 'users', requestedby);

      if (state === 'unmatched') {
        // Handle unmatched state by updating 'unmatched' and 'matched' arrays
        batch.set(
          docRef1,
          {
            matched: {
              true: arrayRemove(requestedby),
              false: arrayUnion(requestedby),
            },
          },
          { merge: true }
        );

        batch.set(
          docRef2,
          {
            matched: {
              true: arrayRemove(requestedof),
              false: arrayUnion(requestedof),
            },
          },
          { merge: true }
        );
      } else if (action === 'add') {
        // Add state to 'requestedme' and 'myrequested'
        batch.set(
          requestedme,
          { [requestedby]: state, createdAt: serverTimestamp() },
          { merge: true }
        );
        batch.set(
          myrequested,
          { [requestedof]: state, createdAt: serverTimestamp() },
          { merge: true }
        );
      } else if (action === 'remove') {
        // Remove state from 'requestedme' and 'myrequested'
        batch.update(requestedme, { [requestedby]: deleteField() });
        batch.update(myrequested, { [requestedof]: deleteField() });
      }

      // Commit the batch
      await batch.commit();

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

  async function getProfilebyUIDs(
    uids: string[]
  ): Promise<FetchUserProfilesResult> {
    try {
      // Fetch profiles from 'usersprofile' collection where document name is in uids
      const usersProfileRef = collection(db, 'usersprofile');
      const q = query(usersProfileRef, where('__name__', 'in', uids));
      const querySnapshot = await getDocs(q);

      // Map the query snapshot docs to the desired structure
      const profiles: UserProfile[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<UserProfile, 'id'>), // Spread the document data without the 'id'
      }));

      return {
        success: true,
        data: profiles,
        lastVisibleDoc: null,
      };
    } catch (error: unknown) {
      console.error('Error fetching profiles:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async function getPrivatebyUIDs(
    uids: string[]
  ): Promise<FetchUserPrivatesResult> {
    try {
      // Fetch profiles from 'usersprofile' collection where document name is in uids
      const usersProfileRef = collection(db, 'users');
      const q = query(usersProfileRef, where('__name__', 'in', uids));
      const querySnapshot = await getDocs(q);

      // Map the query snapshot docs to the desired structure
      const profiles: UserPrivate[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<UserPrivate, 'id'>), // Spread the document data without the 'id'
      }));

      return {
        success: true,
        data: profiles,
      };
    } catch (error: unknown) {
      console.error('Error fetching profiles:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async function getProfilebyUID(uid: string): Promise<SingleProfileResult> {
    try {
      const docRef = doc(db, 'usersprofile', uid);
      const docSnap = await getDoc(docRef);

      // Return data only if the document exists
      const firebaseData: UserProfile = {
        id: docSnap.id,
        ...(docSnap.data() as Omit<UserProfile, 'id'>),
      };

      return { success: true, data: firebaseData };
    } catch (error: unknown) {
      console.error('Error fetching profile:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async function getPrivatebyUID(uid: string): Promise<SinglePrivateResult> {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      // Return data only if the document exists
      const firebaseData: UserPrivate = {
        id: docSnap.id,
        ...(docSnap.data() as Omit<UserPrivate, 'id'>),
      };

      return { success: true, data: firebaseData };
    } catch (error: unknown) {
      console.error('Error fetching profile:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async function getRequestedMe(uid: string): Promise<RequestCollection> {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in');
      }

      const userRef = doc(db, 'requestedme', uid);
      const docSnap = await getDoc(userRef);

      // Return data only if the document exists
      const firebaseData = docSnap.exists() ? docSnap.data() : {};

      return { success: true, data: firebaseData };
    } catch (error: unknown) {
      console.error('Error fetching requested data:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async function getMyRequested(uid: string): Promise<RequestCollection> {
    try {
      if (!currentUser) {
        throw new Error(
          'Authentication Error - try logging out and logging back in'
        );
      }

      const userRef = doc(db, 'myrequested', uid);
      const docSnap = await getDoc(userRef);

      // Return data only if the document exists
      const firebaseData = docSnap.exists() ? docSnap.data() : {};
      return { success: true, data: firebaseData };
    } catch (error: unknown) {
      console.error('Error fetching requested data:', error);
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
      const q = query(
        myRequestCollection
        // limit(limitx),
        // orderBy('createdAt'),
        // startAfter(skip)
      );

      const querySnapshot = await getDocs(q);

      // Extract accepted requests into a result array
      const result = querySnapshot.docs.flatMap((doc) => {
        const docId = doc.id;
        const data = doc.data();

        return Object.entries(data)
          .filter(([, status]) => status === 'accepted') // Filter accepted entries
          .map(([uid]) => [docId, uid] as [string, string]); // Map to [docId, uid]
      });

      return { success: true, data: result };
    } catch (error: unknown) {
      console.error('Error fetching accepted requests:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async function setMatchAdmin(
    profile1: string,
    profile2: string
  ): Promise<VoidResult> {
    const updateMatchedDocs = (batch: WriteBatch) => {
      const docRef1 = doc(db, 'users', profile1);
      const docRef2 = doc(db, 'users', profile2);

      batch.set(
        docRef1,
        {
          matched: {
            true: arrayUnion(profile2),
            false: arrayRemove(profile2),
          },
        },
        { merge: true }
      );
      batch.set(
        docRef2,
        {
          matched: {
            true: arrayUnion(profile1),
            false: arrayRemove(profile1),
          },
        },
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
      console.error(
        'Error in setMatchAdmin:',
        error instanceof Error ? error.message : error
      );
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
        setLoading(true);
        if (!user) {
          console.log('No User Found');
          setCurrentUser(null);
          setUserDataPrivate(null);
          setUserDataProfile(null);
          return;
        }

        setCurrentUser(user);

        const [privateDataSnap, profileDataSnap] = await Promise.all([
          getDoc(doc(db, 'users', user.uid)),
          getDoc(doc(db, 'usersprofile', user.uid)),
        ]);

        setUserDataPrivate(
          privateDataSnap.exists() ? privateDataSnap.data() : {}
        );
        setUserDataProfile(
          profileDataSnap.exists() ? profileDataSnap.data() : {}
        );

        // // if user exists, fetch data from firestore database
        // const docRef = doc(db, 'users', user.uid);
        // const docSnap = await getDoc(docRef);
        // let firebaseData = {};
        // if (docSnap.exists()) {
        //   firebaseData = docSnap.data();
        // }
        // setUserDataPrivate(firebaseData);

        // const docRefP = doc(db, 'usersprofile', user.uid);
        // const docSnapP = await getDoc(docRefP);
        // let firebaseDataP = {};
        // if (docSnapP.exists()) {
        //   firebaseDataP = docSnapP.data();
        // }
        // setUserDataProfile(firebaseDataP);
      } catch (error: any) {
        console.error('Error fetching user data:', error.message);
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
    userProfileUpdate,
    approvalUpdate,
    getProfiles,
    bookmarkUpdate,
    profileRequestUpdate, // i believe it's unused
    requestsUpdate,
    getProfilebyUIDs,
    getPrivatebyUIDs,
    getProfilebyUID,
    getPrivatebyUID,
    getRequestedMe,
    getMyRequested,
    getAllAccepted,
    setMatchAdmin,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
