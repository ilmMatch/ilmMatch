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
  countryCode: number,
  waliCountryCode: number,
  mobileNumber: number,
  waliMobileNumber: number,
  userName: string,
  waliName: string
  approved: string;
  dob: Date;
}


// Define the return type of the function
export interface FetchUserProfilesResult {
  success: boolean;
  profiles?: UserProfile[];
  error?: string;
}



export type RequestAction = 'requested' | 'rejected' | 'accepted' | 'unmatched' | 're-requested';

export interface RequestCollection {
  [key: string]: RequestAction;
}

