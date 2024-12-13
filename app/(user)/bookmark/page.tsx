'use client';
import UserModal from '@/components/userModal';
import { useAuth } from '@/context/AuthProvider';
import { UserProfile } from '@/types/firebase';
import React, { use, useEffect, useState } from 'react';

export default function BookmarkPage() {
    const { userDataPrivate, allProfiles, getProfiles, loading } = useAuth();
    const [bookmarkedProfiles, setBookmarkedProfiles] = useState<UserProfile[]>([]);

    useEffect(() => {
        if (allProfiles.length === 0) {
            getProfiles();
        }
    }, [allProfiles, getProfiles]);

    function filterBookmark() {
        if (!userDataPrivate?.bookmarks || allProfiles.length === 0) return [];

        return allProfiles.filter(profile =>
            userDataPrivate.bookmarks.includes(profile.id)
        );
    }

    useEffect(() => {
        const filteredProfiles = filterBookmark();
        setBookmarkedProfiles(filteredProfiles);
        console.log("filteredProfiles", filteredProfiles);
    }, [userDataPrivate?.bookmarks, allProfiles]);

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <>
            {bookmarkedProfiles &&
                bookmarkedProfiles.map((user) => (
                    <div key={user.id}>
                        <strong>{user.initials}</strong> - {user.id}
                        <UserModal user={user} />
                    </div>
                ))}
        </>
    );
}
