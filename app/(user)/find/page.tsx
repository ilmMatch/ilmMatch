'use client';
import { useAuth } from '@/context/AuthProvider';
import { UserProfile } from '@/types/firebase';
import React, { useEffect, useState } from 'react';
import UserModal from '@/components/userModal';

export default function FindPage() {
    const { getProfiles, allProfiles, currentUser, getRequestedMe, getMyRequested } = useAuth();
    const [users, setUsers] = useState<UserProfile[] | undefined>([]);
    const [buttonStatus, setButtonStatus] = useState<boolean>(false);

    async function getUsers() {
        if (!currentUser) return "you must be logged in"
        if (allProfiles.length > 0) {
            setUsers(allProfiles);
            return;
        }
        const data = await getProfiles();
        const myrequests = await getMyRequested(currentUser?.uid)
        const requestedMe = await getRequestedMe(currentUser.uid);

        if (!data.success) {
            console.log(data.error);
        }

        const profilesWithStatus = data.profiles?.map(profile => ({
            ...profile,
            status: requestedMe[profile.id] ? requestedMe[profile.id] : myrequests[profile.id] ? myrequests[profile.id] : undefined,
            statusFrom: requestedMe[profile.id] ? "requestedMe" : myrequests[profile.id] ? "myrequests" : undefined,
        }));
        setUsers(profilesWithStatus);
    }


    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div>
            {users &&
                users.map((user) => (
                    <div key={user.id}>
                        <strong>{user.initials}</strong> - {user.id}
                        <UserModal user={user} />
                    </div>
                ))}
        </div>
    );
}
