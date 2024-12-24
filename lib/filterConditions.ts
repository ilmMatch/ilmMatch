import { FilterOptions } from '@/types/firebase';
import { where, QueryFieldFilterConstraint, and, or } from 'firebase/firestore';

export function getFilterConditions(filters: FilterOptions) {
  const filterConditions = [];
  const exactMatchFields = [
    'countryResiding',
    'countryMoving',
    'ethnicity',
    'sect',
  ];

  exactMatchFields.forEach((field) => {
    if (filters[field as keyof FilterOptions]) {
      filterConditions.push(
        where(field, '==', filters[field as keyof FilterOptions])
      );
    }
  });

  if (filters.age) {
    const now = new Date();
    if (filters.age.min) {
      const maxDate = new Date(
        now.getFullYear() - filters.age.min,
        now.getMonth(),
        now.getDate()
      );
      filterConditions.push(where('dob', '<=', maxDate));
    }
    if (filters.age.max) {
      const minDate = new Date(
        now.getFullYear() - filters.age.max,
        now.getMonth(),
        now.getDate()
      );
      filterConditions.push(where('dob', '>=', minDate));
    }
  }

  if (filters.gender && filters.gender !== 'all')
    filterConditions.push(where('gender', '==', filters.gender));
  if (filters.polygamy && filters.polygamy !== 'all')
    filterConditions.push(where('polygamy', '==', filters.polygamy));
  if (filters.maritialStatus && filters.maritialStatus !== 'all')
    filterConditions.push(where('maritialStatus', '==', filters.maritialStatus));
  if (filters.born && filters.born !== 'all')
    filterConditions.push(where('born', '==', filters.born));
  if (filters.hijab && filters.hijab !== 'all')
    filterConditions.push(where('hijab', '==', filters.hijab));

  if (filters.beard && filters.beard !== 'all') {
    filterConditions.push(where('beard', '==', filters.beard));
  }

  if (filters.matched && filters.matched !== 'all') {
    if (filters.matched === 'matched') filterConditions.push(where('matched', '!=', []));
    if (filters.matched === 'notmatched') filterConditions.push(where('matched', '==', []));
  }

  if (filters.approved && filters.approved !== 'all') {
    filterConditions.push(where('approved', '==', filters.approved));
  }

  if (filters.spouseAge?.min !== undefined) {
    filterConditions.push(where('spouseAge.max', '>=', filters.spouseAge.min));
  }
  if (filters.spouseAge?.max !== undefined) {
    filterConditions.push(where('spouseAge.min', '<=', filters.spouseAge.max));
  }

  if (filters.height?.max !== undefined) {
    filterConditions.push(where('height', '<=', filters.height.max));
  }
  if (filters.height?.min !== undefined) {
    filterConditions.push(where('height', '>=', filters.height.min));
  }

  if (filters.education) {
    filterConditions.push(where('education', '>=', filters.education));
    filterConditions.push(
      where('education', '<=', filters.education + '\uf8ff')
    );
  }

  if (filters.scholars && filters.scholars.length > 0) {
    filterConditions.push(
      where('scholars', 'array-contains-any', filters.scholars)
    );
  }
  if (filters.languages && filters.languages.length > 0) {
    filterConditions.push(
      where('languages', 'array-contains-any', filters.languages)
    );
  }

  return filterConditions;
}
