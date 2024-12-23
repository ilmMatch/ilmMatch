//  async function requestsUpdate(
//     requestedof: string,
//     requestedby: string,
//     state: RequestAction,
//     action: Action
//   ): Promise<VoidResult> {
//     try {
//       // Ensure the user is logged in
//       if (!currentUser) throw new Error('You must be logged in');

//       // References to the Firestore documents
//       const requestedme = doc(db, 'requestedme', requestedof);
//       const myrequested = doc(db, 'myrequested', requestedby);

//       if (state === 'unmatched') {
//         // Handle unmatched state by updating 'unmatched' and 'matched' arrays
//         await updateMatchStatus(requestedof, requestedby);
//       } else if (action === 'add') {
//         // Add state to 'requestedme' and 'myrequested'
//         await updateRequestState(requestedme, requestedby, state);
//         await updateRequestState(myrequested, requestedof, state);
//       } else if (action === 'remove') {
//         // Remove state from 'requestedme' and 'myrequested'
//         await removeRequestState(requestedme, requestedby);
//         await removeRequestState(myrequested, requestedof);
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
//   // Helper functions for update actions
//   async function updateMatchStatus(requestedof: string, requestedby: string) {
//     const docRef1 = doc(db, 'users', requestedof);
//     const docRef2 = doc(db, 'users', requestedby);

//     await setDoc(
//       docRef1,
//       {
//         matched: {
//           true: arrayRemove(requestedby),
//           false: arrayUnion(requestedby),
//         },
//       },
//       { merge: true }
//     );

//     await setDoc(
//       docRef2,
//       {
//         matched: {
//           true: arrayRemove(requestedof),
//           false: arrayUnion(requestedof),
//         },
//       },
//       { merge: true }
//     );
//   }
//   // Helper functions for update actions
//   async function updateRequestState(
//     docRef: DocumentReference,
//     key: string,
//     state: RequestAction
//   ) {
//     await setDoc(
//       docRef,
//       { [key]: state, createdAt: serverTimestamp() },
//       { merge: true }
//     );
//   }
//   // Helper functions for update actions
//   async function removeRequestState(docRef: DocumentReference, key: string) {
//     await updateDoc(docRef, { [key]: deleteField() });
//   }



















//  async function signup(
//     email: string,
//     password: string,
//     userName: string,
//     gender: string
//   ): Promise<VoidResult> {
//     try {
//       // Create a new user with Firebase Authentication
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );

//       const user = userCredential.user;
//       const userId = user.uid;

//       const userRef = doc(db, 'users', userId);
//       const userRefP = doc(db, 'usersprofile', userId);
//       const timestamp = new Date().toISOString();

//       // Data for the `users` collection
//       const userData = {
//         userName,
//         gender,
//         role: 'user',
//         email,
//         timestamp,
//       };

//       // Data for the `usersprofile` collection
//       const userDataP = {
//         initials: getInitials(userName),
//         gender,
//         timestamp,
//         approved: 'notApproved',
//       };

//       // Write both documents in parallel for efficiency
//       await Promise.all([
//         setDoc(userRef, userData),
//         setDoc(userRefP, userDataP),
//       ]);

//       return { success: true };
//     } catch (error: any) {
//       console.error('Error during signup:', error.message);
//       return {
//         success: false,
//         error:
//           error instanceof Error ? error.message : 'An unknown error occurred',
//       };
//     }
//   }