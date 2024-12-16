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
    if (!userDataPrivate?.bookmarks || userDataPrivate?.bookmarks?.length === 0) {
      // add toast no bookmarks found
      return
    };
    const bookmarkedUID = userDataPrivate.bookmarks

    if (bookmarkedUID?.length === 0) {
      console.log('No bookmarks found for the current user.');
      // add toast
      return
    }
    const data = await getProfilebyUIDs(bookmarkedUID)
    const myrequests = await getMyRequested(currentUser?.uid);
    const requestedMe = await getRequestedMe(currentUser.uid);

    if (!data.success || !myrequests.success || !requestedMe.success) {
      console.log(data.error);
      // add toast
      return
    }
    const profilesWithStatus = data.profiles?.map((profile) => ({
      ...profile,
      status: requestedMe.data[profile.id as keyof typeof requestedMe.data]
        ? requestedMe.data[profile.id as keyof typeof requestedMe.data]?.toString()
        : myrequests.data[profile.id as keyof typeof myrequests.data]
          ? myrequests.data[profile.id as keyof typeof myrequests.data]?.toString()
          : undefined,
      statusFrom: requestedMe.data[profile.id as keyof typeof requestedMe.data]
        ? 'requestedMe'
        : myrequests.data[profile.id as keyof typeof myrequests.data]?.toString()
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
            <UserModal user={user} setStateUsers={setBookmarkedProfiles} stateUsers={bookmarkedProfiles} />
          </div>
        ))}
    </>
  );
}
