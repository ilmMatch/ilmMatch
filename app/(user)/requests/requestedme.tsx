'use client';
import ProfileCard from '@/components/cards/profileCard';
import UserModal from '@/components/userModal';
import { useAuth } from '@/context/AuthProvider';
import { UserProfile } from '@/types/firebase';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function RequestedMe() {
  const { currentUser, getProfilebyUIDs, userDataPrivate, getRequestedMe } =
    useAuth();
  const [requests, setRequests] = useState<UserProfile[] | undefined>([]);
  async function getUsers() {
    if (!currentUser) return 'you must be logged in';
    const requestedMe = await getRequestedMe(currentUser.uid);
    if (!requestedMe.success) {
      toast.error("Uh oh! Something went wrong.", {
        description: requestedMe.error,
      })
      return
    }
    const uids = Object.keys(requestedMe.data);
    if (uids.length === 0) {
      toast.error("Uh oh! Something went wrong.", {
        description: "No requests found",
      })
      return;
    }
    const data = await getProfilebyUIDs(uids);

    if (!data.success) {
      toast.error("Uh oh! Something went wrong.", {
        description: data.error,
      })
      return;
    }

    const requestsWithStatus = data.data?.map((profile) => ({
      ...profile,
      status: requestedMe.data[profile.id as keyof typeof requestedMe.data] ? requestedMe.data[profile.id as keyof typeof requestedMe.data]?.toString() : 'rejected',
      statusFrom: 'requestedMe',
    }));

    setRequests(requestsWithStatus);
  }

  useEffect(() => {
    if (userDataPrivate) {
      console.log('userDataPrivate', userDataPrivate);
      getUsers();
    }
  }, [currentUser]);

  return (
    <>
      {requests &&
        requests.map((user) => (
          user.status &&
          <div key={user.id}>
            <ProfileCard user={user} setStateUsers={setRequests} stateUsers={requests} />
          </div>
        ))}
    </>
  );
}
