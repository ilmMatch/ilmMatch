import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, updateDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCFWxfs2O02DeGB-09l1kGYMB4ke4RKNAw",
    authDomain: "ilmmatch.firebaseapp.com",
    projectId: "ilmmatch",
    storageBucket: "ilmmatch.firebasestorage.app",
    messagingSenderId: "1013556929698",
    appId: "1:1013556929698:web:dd1a6b4e4b7d9bd7eca3fb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function to create user, get UID, and store initial data
const createUserAndStoreData = async (userx) => {
    const password = "securePassword@123"
    const users = generateRandomUsers(30);
    const uids = []
    let index = 0;
    for (const user of users) {
        // if (index <= 10) {
        //     index++;
        //     // await signInWithEmailAndPassword(auth, user.email, password);
        //     continue
        // }
        try {
            // Step 1: Create user
            const userCredential = await signInWithEmailAndPassword(auth, user.email, password);
            const loggedInuser = userCredential.user;
            const userId = loggedInuser.uid;
            // uids.push(userId);


            await setDoc(doc(db, "users", userId), user);
            // console.log(`User ${userId} added to users collection.`);

            // await addToMyRequested(userId);
        } catch (error) {
            console.error("Error creating user or writing to Firestore:", error);
        }
    }
    const uidsfromFunction = await getUIDs()
    await addToMyRequested(uidsfromFunction);

};

// Function to add to "myrequested" with random UID assignment logic
const addToMyRequested = async (uids) => {
    for (const uid of uids) {
        try {
            // Fetch existing documents in the "myrequested" collection
            const docRef = doc(db, "myrequested", uid);
            const docSnap = await getDoc(docRef);

            // if (docSnap.exists()) {
            //     existingDocs.push(...Object.keys(docSnap.data()));
            // }


            // Step 2: Randomly select an existing UID and update the document
            const randomIndex = Math.floor(Math.random() * uids.length);
            const randomUid = uids[randomIndex];

            // Step 3: Update the "myrequested" collection with the new UID
            await updateDoc(docRef, { [randomUid]: "accepted" });
            console.log(`New UID ${uid} added under random existing UID: ${randomUid}`);

        } catch (error) {
            console.error("Error adding or updating 'myrequested' collection:", error);
        }
    }
};


const getUIDs = async () => {
    const db = getFirestore(); // Initialize Firestore
    const colRef = collection(db, "users"); // Replace 'users' with your collection name

    try {
        const querySnapshot = await getDocs(colRef); // Get all documents in the collection

        // Extract document IDs (UIDs) directly
        const uids = querySnapshot.docs.map((doc) => doc.id);
        console.log(uids); // Logs an array of UIDs
        return uids;
    } catch (error) {
        console.error("Error fetching UIDs:", error);
        return [];
    }
};

const generateRandomUsers = (count) => {
    const users = [];
    for (let i = 0; i < count; i++) {
        users.push({
            uid: `user${i}_${Math.random().toString(36).substring(2, 8)}`,
            email: `user${i}@example.com`,
            gender: i % 2 === 0 ? "brother" : "sister",
            role: "user",
            userName: `User ${i}`,
        });
    }
    return users;
};

function runscript() {
    const users = generateRandomUsers(10);
    for (const user of users) {
        createUserAndStoreData(user);
    }

}

runscript()