import { User, UserCredential } from 'firebase/auth';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Action } from '.';

export interface UserProfile {
  id: string;
  childern: string;
  beard: string;
  born: string;
  polygamy: string;
  spouseBrief: string;
  initials: string;
  languages: string[];
  maritalStatus: string;
  ethnicity: string;
  pray: string;
  height: number;
  countryResiding: string;
  build: string;
  masjidName: string;
  occupation: string;
  approved: string;
  education: string;
  scholars: string[];
  briefAboutYou: string;
  sect: string;
  spouseAge: {
    min: number,
    max: number
  };
  countryMoving: string;
  hijab: string;
  dob: { seconds: number; nanoseconds: number };
  gender: string;
  nationality: string;
  islamicEducation: string;
  status?: string;
  statusFrom?: string;
}

export interface UserPrivate {
  id: string;
  email: string;
  userName: string;
  mobileNumber: number;
  waliName: string;
  waliMobileNumber: number;
  gender: string;
  dob: { seconds: number; nanoseconds: number } | Date;
  role: string;
  countryCode: number;
  waliCountryCode: number;
  approved: string;
  bookmark?: string[];
}

// Define the return type of the function

export type FetchUserProfilesResult =
  | {
    success: true;
    data: UserProfile[];
    lastVisibleDoc: QueryDocumentSnapshot<DocumentData> | null;
  }
  | { success: false; error: string };

export type FetchUserPrivatesResult =
  | { success: true; data: UserPrivate[] }
  | { success: false; error: string };

export type SingleProfileResult =
  | { success: true; data: UserProfile }
  | { success: false; error: string };

export type SinglePrivateResult =
  | { success: true; data: UserPrivate }
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

export type VoidResult = { success: true } | { success: false; error: string };

export type ProfileResult =
  | { success: true; data: UserProfile }
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
  userPrivateUpdate: (
    userProfileNew: UserDataPrivateType
  ) => Promise<VoidResult>;
  approvalUpdate: (data: string, uid: string) => Promise<VoidResult>;
  getProfiles: (
    limitx: number,
    lastVisibleDoc: QueryDocumentSnapshot<DocumentData> | null,
    aprroved: string,
    filters: FilterOptions,
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
  getPrivatebyUID: (uid: string) => Promise<SinglePrivateResult>;
  getProfilebyUIDs: (uids: string[]) => Promise<FetchUserProfilesResult>;
  getPrivatebyUIDs: (uids: string[]) => Promise<FetchUserPrivatesResult>;
  getRequestedMe: (uid: string) => Promise<RequestCollection>;
  getMyRequested: (uid: string) => Promise<RequestCollection>;
  getAllAccepted: () => Promise<PairResult>;
  setMatchAdmin: (profile1: string, profile2: string) => Promise<VoidResult>;
  loading: boolean;
}




export interface FilterOptions extends Record<string, any> {
  name?: string;
  countryResiding?: string;
  countryMoving?: string;
  gender?: string;
  education?: string;
  scholars?: string[];
  ethnicity?: string;
  languages?: string[];
  polygamy?: string;
  hijab?: string;
  beard?: string;
  born?: string;
  sect?: string;
  maritalStatus?: string;
  age?: {
    min?: number;
    max?: number;
  };
  spouseAge?: {
    min?: number;
    max?: number;
  };
  height?: {
    min?: number;
    max?: number;
  };
  limit?: number;
}