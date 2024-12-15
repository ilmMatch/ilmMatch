import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



// *********************************************************************************
// This function calculates the difference between two objects(oldData and newData)
// and returns a new object containing only the keys that have been added or modified.
export function getObjectDiff<T extends Record<string, any>>(
  oldData: T,
  newData: T
): Partial<T> {
  const diff: Partial<T> = {};

  // Iterate through all keys in the new data
  for (const key in newData) {
    // Check if the key doesn't exist in old data or the value has changed
    if (
      !(key in oldData) || // New key
      JSON.stringify(oldData[key]) !== JSON.stringify(newData[key]) // Value changed
    ) {
      diff[key] = newData[key];
    }
  }

  return diff;
}

export function getInitials(fullName: string): string {
  const nameParts = fullName.split(' ');

  const initials = nameParts
    .map((part) => part.charAt(0).toUpperCase())
    .join('.');

  return initials;
}
