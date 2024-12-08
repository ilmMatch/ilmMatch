'use client'
import { auth, db } from '@/firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User, UserCredential } from 'firebase/auth'
import { doc, DocumentData, getDoc } from 'firebase/firestore'
import { useContext, useState, useEffect, createContext } from 'react'


interface AuthContextType {
    currentUser: User | null;
    userDataObj: DocumentData | null;
    setUserDataObj: (data: DocumentData | null) => void;
    signup: (email: string, password: string) => Promise<UserCredential>;
    login: (email: string, password: string) => Promise<UserCredential>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  }

export function AuthProvider(props: { children: React.ReactNode }) {
    const { children } = props
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userDataObj, setUserDataObj] = useState<DocumentData | null>(null);
    const [loading, setLoading] = useState(true)

    // AUTH HANDLERS
    async function signup(email: string, password: string) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    async function login(email: string, password: string) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    async function logout() {
        setUserDataObj(null)
        setCurrentUser(null)
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async user => {
            try {
                // Set the user to our local context state
                setLoading(true)
                setCurrentUser(user)
                if (!user) {
                    console.log('No User Found')
                    return
                }

                // if user exists, fetch data from firestore database
                console.log('Fetching User Data')
                const docRef = doc(db, 'users', user.uid)
                const docSnap = await getDoc(docRef)
                let firebaseData = {}
                if (docSnap.exists()) {
                    console.log('Found User Data')
                    firebaseData = docSnap.data()
                }
                setUserDataObj(firebaseData)
            } catch (err: any) {
                console.error('Error fetching user data:', err.message);
            } finally {
                setLoading(false)
            }
        })
        return unsubscribe
    }, [])

    const values: AuthContextType = {
        currentUser,
        userDataObj,
        setUserDataObj,
        signup,
        logout,
        login,
        loading,
      };
    

    return (
        <AuthContext.Provider value= {values}>
        { children }
        </AuthContext.Provider>
    )
}