'use client';
import UserModal from '@/components/userModal';
import { useAuth } from '@/context/AuthProvider';
import { UserProfile } from '@/types/firebase';
import React, { useEffect, useState } from 'react';

export default function RequestedMe() {
  const { currentUser, getProfilebyUIDs, userDataPrivate, getRequestedMe } =
    useAuth();
  const [requests, setRequests] = useState<UserProfile[] | undefined>([]);
  async function getUsers() {
    if (!currentUser) return 'you must be logged in';
    const requestedMe = await getRequestedMe(currentUser.uid);
    if (!requestedMe.success) {
      console.log(requestedMe.error);
      // add toast
    }
    const uids = Object.keys(requestedMe.data);
    if (uids.length === 0) {
      console.log('No requests found for the current user.');
      // add toast
      return;
    }
    const data = await getProfilebyUIDs(uids);

    if (!data.success) {
      console.log(data.error);
      return;
    }

    const requestsWithStatus = data.profiles?.map((profile) => ({
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
          <div key={user.id}>
            <strong>{user.initials}</strong> - {user.id}
            <UserModal user={user} />
          </div>
        ))}
    </>
  );
}
