'use client';
import UserModal from '@/components/userModal';
import { useAuth } from '@/context/AuthProvider';
import { UserProfile } from '@/types/firebase';
import React, { useEffect, useState } from 'react';

export default function MyRequests() {
  const { getProfilebyUIDs, userDataPrivate, currentUser, getMyRequested } =
    useAuth();
  const [myrequests, setMyRequests] = useState<UserProfile[] | undefined>([]);
  async function getUsers() {
    if (!currentUser) return 'you must be logged in';
    console.log("myrequested")
    const myrequests = await getMyRequested(currentUser?.uid);
    if (!myrequests.success) {
      console.log("error")
      // add toast
    }
    const uids = Object.keys(myrequests.data);
    if (uids.length === 0) {
      console.log('you haven&t requested anyone.');
      // add toast
      return;
    }
    const data = await getProfilebyUIDs(uids);
    if (!data.success) {
      console.log(data.error);
    }
    const profilesWithStatus = data.profiles?.map((profile) => ({
      ...profile,
      status: myrequests.data[profile.id as keyof typeof myrequests.data]?.toString(),
      statusFrom: 'myrequests',
    }));

    console.log(profilesWithStatus, "profilesWithStatus")
    setMyRequests(profilesWithStatus);
  }

  useEffect(() => {
    if (userDataPrivate && currentUser) {
      getUsers();
    }
  }, [userDataPrivate, currentUser]);

  return (
    <>
      {myrequests &&
        myrequests.map((user) => (
          <div key={user.id}>
            {user.status}
            <strong>{user.initials}</strong> - {user.id}
            <UserModal user={user} />
          </div>
        ))}
    </>
  );
}
