//   async function approvalUpdate(status: string, uid: string): Promise<VoidResult> {
//     try {
//       const userRef = doc(db, 'usersprofile', uid);
//       await updateDoc(userRef, { approved: status });
//       return { success: true };
//     } catch (error: any) {
//       console.error('Error during updation:', error.message);
//       return {
//         success: false, error: error instanceof Error ? error.message : 'An unknown error occurred'
//       };
//     }
//   }


//   async function getProfiles(limitx: number = 10, aprroved: string = 'approved'): Promise<FetchUserProfilesResult> {
//     try {
//       // Create a reference to the usersprofile collection
//       const usersProfileRef = collection(db, 'usersprofile');

//       // Create a query to fetch only approved profiles
//       const q = query(
//         usersProfileRef,
//         where('approved', '==', aprroved), //possible values = approved | notApproved | requested
//         limit(limitx)
//       );

//       // Execute the query
//       const querySnapshot = await getDocs(q);

//       // Map the documents to an array of data
//       const userProfiles: UserProfile[] = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...(doc.data() as Omit<UserProfile, 'id'>),
//       }));
//       console.log('userProfiles', userProfiles);
//       setAllProfiles(userProfiles);
//       return {
//         success: true,
//         profiles: userProfiles,
//       };
//     } catch (error: any) {
//       console.error('Error fetching user profiles:', error);
//       return {
//         success: false,
//         error:
//           error instanceof Error ? error.message : 'An unknown error occurred',
//       };
//     }
//   }

//   async function bookmarkUpdate(bookmarkUID: string, action: 'add' | 'remove'): Promise<VoidResult> {
//     try {
//       if (!currentUser) throw 'You must be logged in';
//       const userRef = doc(db, 'users', currentUser.uid);
//       if (action === 'add') {
//         await updateDoc(userRef, { bookmarks: arrayUnion(bookmarkUID) });
//       } else if (action === 'remove') {
//         await updateDoc(userRef, { bookmarks: arrayRemove(bookmarkUID) });
//       }
//       return { success: true };
//     } catch (error: any) {
//       console.error('Error during bookmark:', error.message);
//       return {
//         success: false,
//         error:
//           error instanceof Error ? error.message : 'An unknown error occurred',
//       };
//     }
//   }

//   async function profileRequestUpdate(userUID: string, action: 'add' | 'remove'): Promise<VoidResult> {
//     try {
//       if (!currentUser) throw 'You must be logged in';
//       const userRef = doc(db, 'users', currentUser.uid);
//       if (action === 'add') {
//         await updateDoc(userRef, { requested: arrayUnion(userUID) });
//       } else if (action === 'remove') {
//         await updateDoc(userRef, { requested: arrayRemove(userUID) });
//       }
//       return { success: true };
//     } catch (error: any) {
//       console.error('Error during bookmark:', error.message);
//       return {
//         success: false,
//         error:
//           error instanceof Error ? error.message : 'An unknown error occurred',
//       };
//     }
//   }

//   async function requestsUpdate(requestedof: string, requestedby: string, state: RequestAction, action: Action): Promise<VoidResult> {
//     try {
//       console.log("in request Update")
//       if (!currentUser) throw 'You must be logged in';
//       const requestedme = doc(db, 'requestedme', requestedof);
//       const myrequested = doc(db, 'myrequested', requestedby);
//       if (state === 'unmatched') {
//         const docRef1 = doc(db, 'users', requestedof);
//         const docRef2 = doc(db, 'users', requestedby);
//         await setDoc(
//           docRef1,
//           {
//             unmatched: arrayUnion(requestedby),
//             matched: arrayRemove(requestedby),
//           },
//           { merge: true }
//         );
//         await setDoc(
//           docRef2,
//           {
//             unmatched: arrayUnion(requestedof),
//             matched: arrayRemove(requestedof),
//           },
//           { merge: true }
//         );
//       } else if (action === 'add') {
//         await setDoc(requestedme, { [requestedby]: state }, { merge: true });
//         await setDoc(myrequested, { [requestedof]: state }, { merge: true });
//       } else if (action === 'remove') {
//         await updateDoc(requestedme, { [requestedby]: deleteField() });
//         await updateDoc(myrequested, { [requestedof]: deleteField() });
//       }
//       return { success: true };
//     } catch (error: any) {
//       console.error('Error Requesting:', error.message);
//       return {
//         success: false,
//         error:
//           error instanceof Error ? error.message : 'An unknown error occurred',
//       };
//     }
//   }


//  async function getProfilebyUIDs(uids: string[]): Promise<FetchUserProfilesResult> {
//     try {
//       const usersProfileRef = collection(db, 'usersprofile');
//       const q = query(usersProfileRef, where('__name__', 'in', uids));
//       // Fetch the documents
//       const querySnapshot = await getDocs(q);

//       // Process the results
//       const profiles: UserProfile[] = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...(doc.data() as Omit<UserProfile, 'id'>),
//       }));

//       return {
//         success: true,
//         profiles: profiles,
//       };
//     } catch (error) {
//       console.error('Error fetching profiles:', error);
//       return {
//         success: false,
//         error:
//           error instanceof Error ? error.message : 'An unknown error occurred',
//       };
//     }
//   }



//   async function getProfilebyUID(uid: string): Promise<DocumentData> {
//     try {
//       const docRef = doc(db, 'users', uid);
//       const docSnap = await getDoc(docRef);
//       let firebaseData = {};
//       if (docSnap.exists()) {
//         firebaseData = docSnap.data();
//       }
//       return { success: true, data: firebaseData, };
//     } catch (error) {
//       console.error('Error fetching profiles:', error);
//       return {
//         success: false,
//         error:
//           error instanceof Error ? error.message : 'An unknown error occurred',
//       };
//     }
//   }


//   async function getRequestedMe(uid: string): Promise<DocumentData> {
//     try {
//       if (!currentUser) throw 'You must be logged in';
//       // requestedby: field that needs to be updated
//       // requestedof: document Id
//       const userRef = doc(db, 'requestedme', uid);

//       const docSnap = await getDoc(userRef);
//       let firebaseData = {};
//       if (docSnap.exists()) {
//         firebaseData = docSnap.data();
//       }
//       return { success: true, data: firebaseData }
//     } catch (error: any) {
//       console.error('Error Requesting:', error.message);
//       return {
//         success: false,
//         error:
//           error instanceof Error ? error.message : 'An unknown error occurred',
//       };
//     }
//   }



//   async function getMyRequested(uid: string): Promise<DocumentData> {
//     try {
//       if (!currentUser) throw 'You must be logged in';
//       // requestedby: field that needs to be updated
//       // requestedof: document Id
//       const userRef = doc(db, 'myrequested', uid);

//       const docSnap = await getDoc(userRef);
//       let firebaseData = {};
//       if (docSnap.exists()) {
//         firebaseData = docSnap.data();
//       }
//       return { success: true, data: firebaseData };
//     } catch (error: any) {
//       console.error('Error Requesting:', error.message);
//       return {
//         success: false,
//         error:
//           error instanceof Error ? error.message : 'An unknown error occurred',
//       };
//     }
//   }


//   async function getAllAccepted(): Promise<PairResult> {
//     try {
//       const myRequestCollection = collection(db, 'myrequested');
//       const querySnapshot = await getDocs(myRequestCollection);

//       const result: [string, string][] = [];

//       querySnapshot.forEach((doc) => {
//         const docId = doc.id;
//         const data = doc.data();

//         for (const [uid, status] of Object.entries(data)) {
//           if (status === 'accepted') {
//             result.push([docId, uid]);
//           }
//         }
//       });


//       return { success: true, data: result }
//     } catch (error: any) {
//       console.error('Error Requesting:', error.message);
//       return {
//         success: false,
//         error:
//           error instanceof Error ? error.message : 'An unknown error occurred',
//       };
//     }
//   }




// async function setMatchAdmin(profile1: string, profile2: string): Promise<VoidResult> {
//   try {


//     const docRef1 = doc(db, 'users', profile1);
//     const docRef2 = doc(db, 'users', profile2);
//     await setDoc(
//       docRef1,
//       { 'matched.true': arrayUnion(profile2) },
//       { merge: true }
//     );
//     await setDoc(
//       docRef2,
//       { 'matched.true': arrayUnion(profile1) },
//       { merge: true }
//     );

//     const requestedme1 = doc(db, 'requestedme', profile1);
//     const myrequested1 = doc(db, 'myrequested', profile1);
//     const requestedme2 = doc(db, 'requestedme', profile2);
//     const myrequested2 = doc(db, 'myrequested', profile2);

//     if (requestedme1) {
//       await updateDoc(requestedme1, { [profile2]: deleteField() });
//     }
//     if (myrequested1) {
//       await updateDoc(myrequested1, { [profile2]: deleteField() });
//     }
//     if (requestedme2) {
//       await updateDoc(requestedme2, { [profile1]: deleteField() });
//     }
//     if (myrequested2) {
//       await updateDoc(myrequested2, { [profile1]: deleteField() });
//     }

//     return { success: true };
//   } catch (error: any) {
//     console.error('Error in setMatchAdmin:', error.message);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'An unknown error occurred',
//     };
//   }
// }