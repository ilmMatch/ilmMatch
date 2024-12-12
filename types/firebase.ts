export interface UserProfile {
  id: string;
  approved: string;
  // Add other fields specific to your user profile
  // For example:
  name?: string;
  email?: string;
  // Add any other fields your profile might have
}

// Define the return type of the function
export interface FetchUserProfilesResult {
  success: boolean;
  profiles?: UserProfile[];
  error?: string;
}
