import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCFWxfs2O02DeGB-09l1kGYMB4ke4RKNAw',
  authDomain: 'ilmmatch.firebaseapp.com',
  projectId: 'ilmmatch',
  storageBucket: 'ilmmatch.firebasestorage.app',
  messagingSenderId: '1013556929698',
  appId: '1:1013556929698:web:dd1a6b4e4b7d9bd7eca3fb',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function to create user, get UID, and store initial data
const createUserAndStoreData = async (count) => {
  const password = 'unSecurePassword@123';
  for (let i = 0; i < count; i++) {
    try {
      const user = generateRandomUser(i)
      const userProfile = generateUserProfile(i, user)
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, password);
      // const userCredential = await createUserWithEmailAndPassword(auth, user.email, password);
      const loggedInuser = userCredential.user;
      const userId = loggedInuser.uid;

      await setDoc(doc(db, 'users', userId), user);
      await setDoc(doc(db, 'usersprofile', userId), userProfile);

      console.log(`User ${i} added to collection.`);
    } catch (error) {
      console.error('Error creating user or writing to Firestore:', error);
    }
    await delay(3000);
  }
  // const uidsfromFunction = await getUIDs();
  // await addToMyRequested(uidsfromFunction);
};

// const addToMyRequested = async (uids) => {
//   for (const uid of uids) {
//     try {
//       // Fetch existing documents in the "myrequested" collection
//       const docRef = doc(db, 'myrequested', uid);
//       const docSnap = await getDoc(docRef);

//       // if (docSnap.exists()) {
//       //     existingDocs.push(...Object.keys(docSnap.data()));
//       // }

//       // Step 2: Randomly select an existing UID and update the document
//       const randomIndex = Math.floor(Math.random() * uids.length);
//       const randomUid = uids[randomIndex];

//       // Step 3: Update the "myrequested" collection with the new UID
//       await updateDoc(docRef, { [randomUid]: 'accepted' });
//       console.log(
//         `New UID ${uid} added under random existing UID: ${randomUid}`
//       );
//     } catch (error) {
//       console.error(
//         "Error adding or updating 'myrequested' collection:",
//         error
//       );
//     }
//   }
// };


// const getUIDs = async () => {
//   const db = getFirestore(); // Initialize Firestore
//   const colRef = collection(db, 'users'); // Replace 'users' with your collection name

//   try {
//     const querySnapshot = await getDocs(colRef); // Get all documents in the collection

//     // Extract document IDs (UIDs) directly
//     const uids = querySnapshot.docs.map((doc) => doc.id);
//     console.log(uids); // Logs an array of UIDs
//     return uids;
//   } catch (error) {
//     console.error('Error fetching UIDs:', error);
//     return [];
//   }
// };

const generateRandomUser = (index) => {
  const i = index
  const user = {
    email: `user${i}@example.com`,
    userName: `User ${i}'s Name`,
    countryCode: 1,
    mobileNumber: 1234567890,
    waliName: `User ${i}'s wali Name`,
    waliCountryCode: 1,
    waliMobileNumber: 9876543210,
    gender: i % 2 === 0 ? 'brother' : 'sister',
    dob: new Date(new Date().setFullYear(new Date().getFullYear() - 15)),
    role: 'user',
  }
  return user;
};
const generateUserProfile = (index, user) => {
  const i = index;
  const userProfile = {
    initials: `U ${i}`,
    approved: i % 3 === 0 ? "requested" : 'approved',
    dob: user.dob,
    gender: user.gender,
    height: 173,
    build: "Fit",
    beard: "yes",
    hijab: "niqab",
    sect: "Alh us Sunnah wal Jammah",
    born: i % 4 === 0 ? "revert" : 'muslim',
    nationality: "Indian",
    ethnicity: "Indian",
    occupation: "Developer",
    education: "B.E",
    islamicEducation: "Zad Academy",
    scholars: "Shaykh Bin Baz",
    masjidName: "Near by masjid",
    languages: "Hindi, English, Learning Arabic",
    polygamy: i % 9 === 0 ? "yes" : i % 4 ? "under certain Circumstances" : 'no',
    pray: "Yes",
    maritalStatus: "unmarried",
    childern: "no",
    countryResiding: "India",
    countryMoving: "Medina, Saudi Arabia",
    briefAboutYou: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.Excepturi quis, cumque tempora unde accusantium a sunt molestiae.Sed quaerat laboriosam culpa dignissimos cupiditate, sunt maiores eum voluptates.Eveniet quasi in non cum iste accusamus possimus esse quia, qui blanditiis ad, corrupti enim voluptatibus recusandae dolorem! Corporis id, necessitatibus eos unde ex ut provident! Commodi cum perferendis id accusantium nostrum doloremque voluptates odio, ipsum dolorem debitis perspiciatis et hic corporis ratione quasi magni aut numquam quia culpa voluptatem deleniti, amet totam reprehenderit suscipit.Voluptate totam odio maxime atque nisi ullam, sunt beatae similique at explicabo in aspernatur aliquid dignissimos nobis optio temporibus quo suscipit iste minus iusto iure.Dolorem obcaecati voluptatibus quis veniam porro ipsum autem, officia pariatur a quibusdam aliquid, perspiciatis, est nesciunt amet corporis cumque atque labore sunt temporibus odit.Quidem nam quam saepe expedita, possimus nesciunt fugiat.Temporibus quam ratione modi officiis nostrum minima, voluptas qui mollitia beatae optio eum inventore enim natus sint voluptatum distinctio molestias accusamus accusantium ipsa.Necessitatibus vero recusandae exercitationem saepe sequi, quis adipisci alias dolorum non reiciendis nesciunt atque consectetur blanditiis incidunt ipsum cupiditate fugiat expedita inventore quia, tenetur quibusdam commodi modi corporis magnam.Placeat nam id dolores cumque quasi iure minima dolorem.Nulla autem est possimus aspernatur, temporibus error sed consectetur quidem officia fuga nobis mollitia, a dicta necessitatibus.Nam, perspiciatis.Autem atque nemo quasi numquam dicta vero unde, delectus fugiat esse explicabo amet.Laudantium aspernatur aliquam temporibus eveniet dolorum labore vel voluptatem error atque nemo sequi tempora, et voluptates blanditiis eos.Sint assumenda itaque eaque.Fugit placeat reprehenderit voluptatum minus voluptas, enim repellat iste harum a explicabo dolores, sed laboriosam dignissimos?",
    spouseAge: "19-23",
    spouseBrief: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.Excepturi quis, cumque tempora unde accusantium a sunt molestiae.Sed quaerat laboriosam culpa dignissimos cupiditate, sunt maiores eum voluptates.Eveniet quasi in non cum iste accusamus possimus esse quia, qui blanditiis ad, corrupti enim voluptatibus recusandae dolorem! Corporis id, necessitatibus eos unde ex ut provident! Commodi cum perferendis id accusantium nostrum doloremque voluptates odio, ipsum dolorem debitis perspiciatis et hic corporis ratione quasi magni aut numquam quia culpa voluptatem deleniti, amet totam reprehenderit suscipit.Voluptate totam odio maxime atque nisi ullam, sunt beatae similique at explicabo in aspernatur aliquid dignissimos nobis optio temporibus quo suscipit iste minus iusto iure.Dolorem obcaecati voluptatibus quis veniam porro ipsum autem, officia pariatur a quibusdam aliquid, perspiciatis, est nesciunt amet corporis cumque atque labore sunt temporibus odit.Quidem nam quam saepe expedita, possimus nesciunt fugiat.Temporibus quam ratione modi officiis nostrum minima, voluptas qui mollitia beatae optio eum inventore enim natus sint voluptatum distinctio molestias accusamus accusantium ipsa.Necessitatibus vero recusandae exercitationem saepe sequi, quis adipisci alias dolorum non reiciendis nesciunt atque consectetur blanditiis incidunt ipsum cupiditate fugiat expedita inventore quia, tenetur quibusdam commodi modi corporis magnam.Placeat nam id dolores cumque quasi iure minima dolorem.Nulla autem est possimus aspernatur, temporibus error sed consectetur quidem officia fuga nobis mollitia, a dicta necessitatibus.Nam, perspiciatis.Autem atque nemo quasi numquam dicta vero unde, delectus fugiat esse explicabo amet.Laudantium aspernatur aliquam temporibus eveniet dolorum labore vel voluptatem error atque nemo sequi tempora, et voluptates blanditiis eos.Sint assumenda itaque eaque.Fugit placeat reprehenderit voluptatum minus voluptas, enim repellat iste harum a explicabo dolores, sed laboriosam dignissimos?"
  }
  return userProfile;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function runscript() {
  createUserAndStoreData(20);
}

runscript();
