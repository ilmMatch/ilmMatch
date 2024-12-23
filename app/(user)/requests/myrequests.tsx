'use client';
import ProfileCard from '@/components/cards/profileCard';
import UserModal from '@/components/modals/userModal';
import { useAuth } from '@/context/AuthProvider';
import { UserProfile } from '@/types/firebase';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function MyRequests() {
  const { getProfilebyUIDs, userDataPrivate, currentUser, getMyRequested } =
    useAuth();
  const [myrequests, setMyRequests] = useState<UserProfile[] | undefined>([]);
  async function getUsers() {
    if (!currentUser) return 'you must be logged in';
    console.log('myrequested');
    const myrequests = await getMyRequested(currentUser?.uid);
    if (!myrequests.success) {
      toast.error('Uh oh! Something went wrong.', {
        description: myrequests.error,
      });
      return;
    }
    const uids = Object.keys(myrequests.data);
    if (uids.length === 0) {
      toast.error('Uh oh! Something went wrong.', {
        description: "you haven't requested anyone.",
      });
      return;
    }
    const data = await getProfilebyUIDs(uids);
    if (!data.success) {
      toast.error('Uh oh! Something went wrong.', {
        description: data.error,
      });
      return;
    }
    const profilesWithStatus = data.data?.map((profile) => ({
      ...profile,
      status:
        myrequests.data[profile.id as keyof typeof myrequests.data]?.toString(),
      statusFrom: 'myrequests',
    }));

    console.log(profilesWithStatus, 'profilesWithStatus');
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
        myrequests.map(
          (user) =>
            user.status && (
              <div key={user.id}>
                {/* <UserModal  /> */}
                <ProfileCard
                  user={user}
                  setStateUsers={setMyRequests}
                  stateUsers={myrequests}
                />
              </div>
            )
        )}
    </>
  );
}
