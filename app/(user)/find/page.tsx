'use client';
import { useAuth } from '@/context/AuthProvider';
import { UserProfile } from '@/types/firebase';
import React, { useEffect, useState } from 'react';
import UserModal from '@/components/userModal';
import { Button } from '@/components/ui/button';

export default function FindPage() {
  const {
    getProfiles,
    currentUser,
    getRequestedMe,
    getMyRequested,
  } = useAuth();
  const [users, setUsers] = useState<UserProfile[] | undefined>([]);
  const [skip, setSkip] = useState(0);
  const [end, setEnd] = useState(false);

  async function getUsers() {
    if (!currentUser) return 'you must be logged in';


    const data = await getProfiles(10, skip, 'approved');
    if (!data.success) {
      console.log(data.error);
      // add toast
      return;
    }

    const myrequests = await getMyRequested(currentUser?.uid);
    if (!myrequests.success) {
      console.log(myrequests.error);
      // add toast
      return;
    }

    const requestedMe = await getRequestedMe(currentUser.uid);
    if (!requestedMe.success) {
      console.log(requestedMe.error);
      // add toast
      return;
    }

    const profilesWithStatus = data.data?.map((profile) => {
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

    setEnd(profilesWithStatus?.length < 10);
    setUsers(profilesWithStatus);
  }

  useEffect(() => {
    getUsers();
  }, [currentUser, skip]);

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
      {end ? "You've reached the end" :
        <Button onClick={() => setSkip(skip + 10)}>Load More</Button>
      }
    </div>
  );
}
