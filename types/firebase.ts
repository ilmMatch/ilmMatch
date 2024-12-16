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
  id: string;
  bookmark?: string[];
  countryCode: number;
  waliCountryCode: number;
  mobileNumber: number;
  waliMobileNumber: number;
  role: string;
  userName: string;
  waliName: string;
  approved: string;
  dob: Date;
}

// Define the return type of the function

export type FetchUserProfilesResult =
  | { success: true; data: UserProfile[]; }
  | { success: false; error: string };


export type FetchUserPrivatesResult =
  | { success: true; data: UserPrivate[]; }
  | { success: false; error: string };

export type SingleProfileResult =
  | { success: true; data: UserProfile }
  | { success: false; error: string };

export type RequestAction =
  | 'requested'
  | 'rejected'
  | 'accepted'
  | 'unmatched'
  | 're-requested'
  | undefined;

export type RequestCollection =
  | { success: true; data: { [key: string]: RequestAction } }
  | { success: false; error: string };

export type VoidResult =
  | { success: true }
  | { success: false; error: string };

export type ProfileResult =
  | { success: true, data: UserProfile }
  | { success: false; error: string };


export interface UserDataPrivateType {
  userName: string;
  mobileNumber: number | null;
  waliName: string;
  waliMobileNumber: number | null;
  dob: Date;
  gender: string;
}


export type PairResult =
  | { success: true; data: [string, string][] }
  | { success: false; error: string };


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
  ) => Promise<VoidResult>;
  login: (email: string, password: string) => Promise<VoidResult>;
  forgetPassword: (email: string) => Promise<VoidResult>;
  logout: () => Promise<VoidResult>;
  roleManager: (userId: string, role: string) => Promise<VoidResult>;
  userPrivateUpdate: (userProfileNew: UserDataPrivateType) => Promise<VoidResult>;
  approvalUpdate: (data: string, uid: string) => Promise<VoidResult>;
  getProfiles: (
    limitx: number,
    skip: number,
    aprroved: string
  ) => Promise<FetchUserProfilesResult>;
  allProfiles: UserProfile[];
  bookmarkUpdate: (
    bookmarkUID: string,
    action: 'add' | 'remove'
  ) => Promise<VoidResult>;
  profileRequestUpdate: (
    userUID: string,
    action: 'add' | 'remove'
  ) => Promise<VoidResult>;
  requestsUpdate: (
    requestedof: string,
    requestedby: string,
    state: RequestAction,
    action: Action
  ) => Promise<VoidResult>;
  getProfilebyUID: (uid: string) => Promise<SingleProfileResult>;
  getProfilebyUIDs: (uids: string[]) => Promise<FetchUserProfilesResult>;
  getPrivatebyUIDs: (uids: string[]) => Promise<FetchUserPrivatesResult>;
  getRequestedMe: (uid: string) => Promise<RequestCollection>;
  getMyRequested: (uid: string) => Promise<RequestCollection>;
  getAllAccepted: () => Promise<PairResult>;
  setMatchAdmin: (profile1: string, profile2: string) => Promise<VoidResult>;
  loading: boolean;
}