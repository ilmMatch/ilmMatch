'use client';
import { useAuth } from '@/context/AuthProvider';
import { UserProfile } from '@/types/firebase';
import React, { useEffect, useState } from 'react';
import UserModal from '@/components/userModal';

export default function FindPage() {
  const {
    getProfiles,
    currentUser,
    getRequestedMe,
    getMyRequested,
  } = useAuth();
  const [users, setUsers] = useState<UserProfile[] | undefined>([]);
  const [buttonStatus, setButtonStatus] = useState<boolean>(false);

  async function getUsers() {
    if (!currentUser) return 'you must be logged in';

    const data = await getProfiles(10, 'approved');
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
    setUsers(profilesWithStatus);
  }

  useEffect(() => {
    getUsers();
  }, [currentUser]);

  return (
    <div>
      {users &&
        users.map((user) => (
          <div key={user.id}>
            <strong>{user.initials}</strong> - {user.id}
            {user.status && <p>{user.status}</p>}
            <UserModal user={user} setStateUsers={setUsers} stateUsers={users} />
          </div>
        ))}
    </div>
  );
}
