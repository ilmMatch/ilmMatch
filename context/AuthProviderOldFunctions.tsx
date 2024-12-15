

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