'use client';
import UserModal from '@/components/userModal';
import { useAuth } from '@/context/AuthProvider';
import { UserProfile } from '@/types/firebase';
import { set } from 'date-fns';
import React, { use, useEffect, useState } from 'react';
import { toast } from 'sonner';

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
      toast.error("Uh oh!", {
        description: "No bookmark found",
      })
      return
    };
    const bookmarkedUID = userDataPrivate.bookmarks

    if (bookmarkedUID?.length === 0) {
      toast.error("Uh oh!", {
        description: "No bookmark found",
      })
      return
    }

    const data = await getProfilebyUIDs(bookmarkedUID)
    if (!data.success) {
      toast.error("Uh oh! Something went wrong.", {
        description: data.error,
      })
      return;
    }

    const myrequests = await getMyRequested(currentUser?.uid);
    if (!myrequests.success) {
      toast.error("Uh oh! Something went wrong.", {
        description: myrequests.error,
      })
      return;
    }

    const requestedMe = await getRequestedMe(currentUser.uid);
    if (!requestedMe.success) {
      toast.error("Uh oh! Something went wrong.", {
        description: requestedMe.error,
      })
      return;
    }


    const profilesWithStatus = data.data.map((profile) => {
      const requestedStatus = requestedMe.data[profile.id as keyof typeof requestedMe.data];
      const myRequestStatus = myrequests.data[profile.id as keyof typeof myrequests.data];

      return {
        ...profile,
        status: requestedStatus
          ? requestedStatus.toString()
          : myRequestStatus
            ? myRequestStatus.toString()
            : undefined,
        statusFrom: requestedStatus
          ? 'requestedMe'
          : myRequestStatus
            ? 'myrequests'
            : undefined,
      };
    });
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
