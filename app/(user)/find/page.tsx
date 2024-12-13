'use client';
import { useAuth } from '@/context/AuthProvider';
import { UserProfile } from '@/types/firebase';
import React, { useEffect, useState } from 'react';
import UserModal from '@/components/userModal';

export default function FindPage() {
    const { getProfiles, allProfiles } = useAuth();
    const [users, setUsers] = useState<UserProfile[] | undefined>([]);

    async function getUsers() {
        if (allProfiles.length > 0) {
            setUsers(allProfiles);
            return;
        }
        const data = await getProfiles();
        if (!data.success) {
            console.log(data.error);
        }
        setUsers(data.profiles);
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
