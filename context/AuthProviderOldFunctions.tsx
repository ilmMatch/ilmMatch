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