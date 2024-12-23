"use client"
import { FilterModal } from '@/components/filterModal';
import { PrivateForm } from '@/components/forms/testPrivate';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthProvider';
import { FilterOptions, UserProfile } from '@/types/firebase';
import React, { useState } from 'react'

export default function FilterPage() {

    const { currentUser, userDataPrivate, getProfiles } = useAuth();
    const [data, setData] = useState<UserProfile[] | undefined>([]);
    const [filters, setFilters] = useState<FilterOptions>({
        name: '',
        gender: '',
        education: '',
        ethnicity: '',
        // languages: [],
        // scholars: [],
        polygamy: '',
        spouseAge: { min: undefined, max: undefined },
        height: { min: 150, max: 200 },
    });
    async function getUsers() {
        if (!currentUser || !userDataPrivate) return 'you must be logged in';

        // Define your filters
        // const filters = {
        //     gender: "sister"  // This will match exactly "sister"
        // };

        // Pass the filters to getProfiles
        const data = await getProfiles(10, null, 'approved', filters);

        if (!data.success) {
            console.log(data.error);
            return;
        }

        console.log(data.data);
        setData(data.data);
    }
    return (
        <div>FilterPage

            <Button onClick={getUsers}>getUsers</Button>
            <FilterModal
                filters={filters}
                setFilters={setFilters} />
            {data?.map((user: UserProfile) => {
                return (
                    <>{JSON.stringify(user, null, 2)}</>
                );
            })}

            <PrivateForm />
        </div>
    )
}
