'use client';
import UserModal from '@/components/userModal';
import { useAuth } from '@/context/AuthProvider';
import { UserProfile } from '@/types/firebase';
import React, { use, useEffect, useState } from 'react';

export default function AcceptedPage() {
  const { userDataPrivate, getProfilebyUIDs } = useAuth();
  const [users, setUsers] = useState<UserProfile[] | undefined>(undefined);

  async function getMatchedProfiles() {
    if (!userDataPrivate || userDataPrivate.matched.length === 0) return;
    const data = await getProfilebyUIDs(userDataPrivate.matched);
    if (!data.success) {
      console.log(data.error);
    }

    const profilesWithStatus = data.profiles?.map((profile) => ({
      ...profile,
      status: 'matched',
      statusFrom: 'matched',
    }));
    setUsers(profilesWithStatus);
  }
  useEffect(() => {
    if (!users) {
      getMatchedProfiles();
    }
  }, [userDataPrivate]);
  return (
    <>
      {users &&
        users.map((user) => (
          <div key={user.id} className="border">
            <p>{user.initials}</p>
            <UserModal user={user} setStateUsers={setUsers} stateUsers={users} />
          </div>
        ))}
    </>
  );
}
