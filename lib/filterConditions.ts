import { FilterOptions } from '@/types/firebase';
import { where, QueryFieldFilterConstraint, and, or } from 'firebase/firestore';


export function getFilterConditions(filters: FilterOptions) {

    const filterConditions = [];
    const exactMatchFields = [
        'countryResiding',
        'countryMoving',
        'gender',
        'ethnicity',
        'polygamy',
        'spouseAge',
        'hijab',
        'beard',
        'born',
        'sect',
        'maritalStatus'
    ];

    exactMatchFields.forEach(field => {
        if (filters[field as keyof FilterOptions]) {
            filterConditions.push(where(field, '==', filters[field as keyof FilterOptions]));
        }
    });

    if (filters.age) {
        const now = new Date();
        if (filters.age.min) {
            const maxDate = new Date(now.getFullYear() - filters.age.min, now.getMonth(), now.getDate());
            filterConditions.push(where('dob', '<=', maxDate));
        }
        if (filters.age.max) {
            const minDate = new Date(now.getFullYear() - filters.age.max, now.getMonth(), now.getDate());
            filterConditions.push(where('dob', '>=', minDate));
        }
    }

    // Text search conditions (using array-contains or string includes)
    if (filters.spouseAgeMin && filters.spouseAgeMax) {
        filterConditions.push(where('spouseAge', '>=', filters.spouseAgeMin.toString()));
        filterConditions.push(where('spouseAge', '<=', filters.spouseAgeMax.toString()));
    }
    if (filters.heightMin && filters.heightMax) {
        filterConditions.push(where('height', '>=', filters.heightMin));
        filterConditions.push(where('height', '<=', filters.heightMax));
    }

    if (filters.name) {
        filterConditions.push(where('masjidName', '>=', filters.name));
        filterConditions.push(where('masjidName', '<=', filters.name + '\uf8ff'));
    }

    if (filters.education) {
        filterConditions.push(where('education', '>=', filters.education));
        filterConditions.push(where('education', '<=', filters.education + '\uf8ff'));
    }

    const handleCommaField = (fieldValue: string | undefined, fieldName: string) => {
        if (fieldValue) {
            // Convert search terms to lowercase for case-insensitive comparison
            const searchTerms = fieldValue.toLowerCase().split(',').map(term => term.trim());

            // Create conditions for each term
            const termConditions = searchTerms.map(term =>
                and(
                    where(fieldName, '>=', term),
                    where(fieldName, '<=', term + '\uf8ff')
                )
            );

            if (termConditions.length > 0) {
                filterConditions.push(or(...termConditions));
            }
        }
    };

    // Apply the comma-separated field handling to both languages and scholars
    handleCommaField(filters.languages, 'languages');
    handleCommaField(filters.scholars, 'scholars');

    return filterConditions
}
// export function getFilterConditions(filters: FilterOptions): QueryFieldFilterConstraint[] {
//     const conditions: QueryFieldFilterConstraint[] = [];

//     if (filters.gender) conditions.push(where('gender', '==', filters.gender));
//     if (filters.education) conditions.push(where('education', '==', filters.education));
//     if (filters.ethnicity) conditions.push(where('ethnicity', '==', filters.ethnicity));
//     if (filters.polygamy) conditions.push(where('polygamy', '==', filters.polygamy));
//     if (filters.country) conditions.push(where('countryResiding', '==', filters.country));

//     if (filters.spouseAgeMin && filters.spouseAgeMax) {
//         conditions.push(where('spouseAge', '>=', filters.spouseAgeMin.toString()));
//         conditions.push(where('spouseAge', '<=', filters.spouseAgeMax.toString()));
//     }
//     if (filters.heightMin && filters.heightMax) {
//         conditions.push(where('height', '>=', filters.heightMin));
//         conditions.push(where('height', '<=', filters.heightMax));
//     }

//     if (filters.scholars && filters.scholars.length > 0) {
//         conditions.push(where('scholars', 'array-contains-any', filters.scholars));
//     }
//     if (filters.languages && filters.languages.length > 0) {
//         conditions.push(where('languages', 'array-contains-any', filters.languages));
//     }

//     return conditions;
// }

