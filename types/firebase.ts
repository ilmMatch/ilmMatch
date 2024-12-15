import { User, UserCredential } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import { Action } from ".";


export interface UserProfile {
  id: string;
  approved: string;
  // Add other fields specific to your user profile
  // For example:
  initials?: string;
  email?: string;
  status?: string;
  statusFrom?: string;
  // Add any other fields your profile might have
}

export interface UserPrivate {
  bookmark?: string[];
  countryCode: number;
  waliCountryCode: number;
  mobileNumber: number;
  waliMobileNumber: number;
  userName: string;
  waliName: string;
  approved: string;
  dob: Date;
}

// Define the return type of the function
export interface FetchUserProfilesResult {
  success: boolean;
  profiles?: UserProfile[];
  error?: string;
}

export type RequestAction =
  | 'requested'
  | 'rejected'
  | 'accepted'
  | 'unmatched'
  | 're-requested';

export interface RequestCollection {
  [key: string]: RequestAction;
}




export interface UserDataPrivateType {
  userName: string;
  mobileNumber: number | null;
  waliName: string;
  waliMobileNumber: number | null;
  dob: Date;
  gender: string;
}

export interface AuthContextType {
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