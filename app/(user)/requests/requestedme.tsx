'use client'
import UserModal from '@/components/userModal'
import { useAuth } from '@/context/AuthProvider'
import { UserProfile } from '@/types/firebase'
import React, { useEffect, useState } from 'react'

export default function RequestedMe() {
    const { currentUser, getProfilebyUIDs, userDataPrivate, getRequestedMe } = useAuth()
    const [requests, setRequests] = useState<UserProfile[] | undefined>([])
    async function getUsers() {
        if (!currentUser) return "you must be logged in"
        const requestsCollection = await getRequestedMe(currentUser.uid)
        const uids = Object.keys(requestsCollection);

        const data = await getProfilebyUIDs(uids);

        if (!data.success) {
            console.log(data.error);
            return;
        }

        const requestsWithStatus = data.profiles?.map(profile => ({
            ...profile,
            status: requestsCollection[profile.id]
        }));

        setRequests(requestsWithStatus);
    }

    useEffect(() => {

        if (userDataPrivate) {
            console.log("userDataPrivate", userDataPrivate)
            getUsers();
        }
    }, [currentUser]);

    return (
        <>{requests &&
            requests.map((user) => (
                <div key={user.id}>
                    <strong>{user.initials}</strong> - {user.id}
                    <UserModal user={user} />
                </div>
            ))}</>
    )
}
