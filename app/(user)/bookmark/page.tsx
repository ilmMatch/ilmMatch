'use client';
import UserModal from '@/components/userModal';
import { useAuth } from '@/context/AuthProvider';
import { UserProfile } from '@/types/firebase';
import { set } from 'date-fns';
import React, { use, useEffect, useState } from 'react';

export default function BookmarkPage() {
  const {
    userDataPrivate,
    loading,
    currentUser,
    getRequestedMe,
    getMyRequested,
    getProfilebyUIDs,
  } = useAuth();

  const [bookmarkedProfiles, setBookmarkedProfiles] = useState<UserProfile[] | undefined>(
    []
  );


  async function filterBookmark() {
    if (!currentUser) return 'you must be logged in';
    if (!userDataPrivate?.bookmarks) return [];
    const bookmarkedUID = userDataPrivate.bookmarks

    if (bookmarkedUID?.length === 0) {
      console.log('No bookmarks found for the current user.');
      // add toast
      return
    }
    const data = await getProfilebyUIDs(bookmarkedUID)
    if (!data.success) {
      console.log(data.error);
      // add toast
    }


    const myrequests = await getMyRequested(currentUser?.uid);
    const requestedMe = await getRequestedMe(currentUser.uid);

    const profilesWithStatus = data.profiles?.map((profile) => ({
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
  }, [userDataPrivate?.bookmarks]);

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
