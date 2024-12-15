'use client';
import UserModal from '@/components/userModal';
import { useAuth } from '@/context/AuthProvider';
import { UserProfile } from '@/types/firebase';
import React, { use, useEffect, useState } from 'react';

export default function BookmarkPage() {
  const {
    userDataPrivate,
    allProfiles,
    getProfiles,
    loading,
    currentUser,
    getRequestedMe,
    getMyRequested,
  } = useAuth();
  const [bookmarkedProfiles, setBookmarkedProfiles] = useState<UserProfile[]>(
    []
  );

  useEffect(() => {
    if (allProfiles.length === 0) {
      getProfiles();
    }
  }, [allProfiles, getProfiles]);

  async function filterBookmark() {
    if (!currentUser) return 'you must be logged in';
    if (!userDataPrivate?.bookmarks || allProfiles.length === 0) return [];

    const filteredProfiles = allProfiles.filter((profile) =>
      userDataPrivate.bookmarks.includes(profile.id)
    );
    const myrequests = await getMyRequested(currentUser?.uid);
    const requestedMe = await getRequestedMe(currentUser.uid);

    const profilesWithStatus = filteredProfiles?.map((profile) => ({
      ...profile,
      status: requestedMe[profile.id]
        ? requestedMe[profile.id]
        : myrequests[profile.id]
          ? myrequests[profile.id]
          : undefined,
      statusFrom: requestedMe[profile.id]
        ? 'requestedMe'
        : myrequests[profile.id]
          ? 'myrequests'
          : undefined,
    }));
    setBookmarkedProfiles(profilesWithStatus);
    return profilesWithStatus;
  }

  useEffect(() => {
    filterBookmark();
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
