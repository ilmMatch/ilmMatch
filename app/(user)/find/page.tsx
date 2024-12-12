'use client';
import { CustomPhoneInput } from '@/components/forms/fields/mobileInput';
import { useAuth } from '@/context/AuthProvider';
import { UserProfile } from '@/types/firebase';
import React, { useEffect, useState } from 'react';

export default function FindPage() {
    const { getProfiles } = useAuth();
    const [users, setUsers] = useState<UserProfile[] | undefined>([]);


    const [mobileNumber, setMobileNumber] = useState({ countryCode: '', phoneNumber: '' })

    const handleMobileNumberChange = (countryCode: string, phoneNumber: string) => {
        setMobileNumber({ countryCode, phoneNumber })
    }
    async function getUsers() {
        const data = await getProfiles();
        if (!data.success) {
            console.log(data.error);
        }
        setUsers(data.profiles);
    }

    //   useEffect(() => {
    //     getUsers();
    //   }, []);
    return (<div>

        <CustomPhoneInput onChange={handleMobileNumberChange} className={'border-red-50 border'} />
        page
    </div>
    );
}
