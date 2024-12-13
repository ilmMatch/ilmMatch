'use client'
import UserModal from '@/components/userModal'
import { useAuth } from '@/context/AuthProvider'
import { UserProfile } from '@/types/firebase'
import React, { useEffect, useState } from 'react'

export default function MyRequests() {
    const { getProfilebyUIDs, userDataPrivate } = useAuth()
    const [myrequests, setMyRequests] = useState<UserProfile[] | undefined>([])
    async function getUsers() {
        const data = await getProfilebyUIDs(userDataPrivate?.requested);
        if (!data.success) {
            console.log(data.error);
        }
        setMyRequests(data.profiles);
    }

    useEffect(() => {
        if (userDataPrivate) {
            console.log("userDataPrivate", userDataPrivate)
            getUsers();
        }
    }, [userDataPrivate]);

    return (
        <>{myrequests &&
            myrequests.map((user) => (
                <div key={user.id}>
                    <strong>{user.initials}</strong> - {user.id}
                    <UserModal user={user} />
                </div>
            ))}</>
    )
}
