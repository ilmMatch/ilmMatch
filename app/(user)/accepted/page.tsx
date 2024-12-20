'use client';
import ProfileCard from '@/components/profileCard';
import UserModal from '@/components/userModal';
import { useAuth } from '@/context/AuthProvider';
import { UserProfile } from '@/types/firebase';
import React, { use, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AcceptedPage() {
  const { userDataPrivate, getProfilebyUIDs } = useAuth();
  const [users, setUsers] = useState<UserProfile[] | undefined>(undefined);

  async function getMatchedProfiles() {
    if (!userDataPrivate || userDataPrivate.matched.true.length === 0) {

      toast.error("Uh oh! No matches found.", {
        description: "if you've accepted a request, wait till admin confirms",
      })
      return
    };
    const data = await getProfilebyUIDs(userDataPrivate.matched.true);
    if (!data.success) {
      toast.error("Uh oh! Something went wrong.", {
        description: data.error,
      })
      return
    }

    const profilesWithStatus = data.data.map((profile) => ({
      ...profile,
      status: 'matched',
      statusFrom: 'matched',
    }));
    setUsers(profilesWithStatus);
  }
  useEffect(() => {
    if (userDataPrivate) {
      getMatchedProfiles();
    }
  }, [userDataPrivate]);
  return (
    <>
      {users &&
        users.map((user) => (
          <div key={user.id}>
            <ProfileCard user={user} setStateUsers={setUsers} stateUsers={users} />
          </div>
        ))}
    </>
  );
}
