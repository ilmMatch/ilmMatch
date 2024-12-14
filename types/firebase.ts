export interface UserProfile {
  id: string;
  approved: string;
  // Add other fields specific to your user profile
  // For example:
  initials?: string;
  email?: string;
  status?: string;
  // Add any other fields your profile might have
}

// Define the return type of the function
export interface FetchUserProfilesResult {
  success: boolean;
  profiles?: UserProfile[];
  error?: string;
}



export type RequestAction = 'requested' | 'rejected' | 'accepted' | 'unmatched';

export interface RequestCollection {
  [key: string]: RequestAction;
}
