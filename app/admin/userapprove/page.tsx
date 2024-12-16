'use client';
import { Button } from '@/components/ui/button';
import UserModal from '@/components/userModal';
import { useAuth } from '@/context/AuthProvider';
import { UserProfile } from '@/types/firebase';
import React, { useEffect, useState } from 'react';

export default function UserApprovePage() {
  const { getProfiles } = useAuth();
  const [unApprovedProfiles, setUnApprovedProfiles] = useState<
    UserProfile[] | undefined
  >([]);
  const [skip, setSkip] = useState(0);
  const [end, setEnd] = useState(false);

  async function getUsers() {
    const data = await getProfiles(10, skip, 'requested');
    if (!data.success) {
      console.log(data.error);
      // add toast
      return
    }
    const isEnd = data.profiles ? data.profiles.length < 10 : true
    setEnd(isEnd);
    const profilesWithStatus = data.profiles?.map((profile) => ({
      ...profile,
      status: 'requested',
      statusFrom: 'adminApprove',
    }));
    setUnApprovedProfiles(profilesWithStatus);
  }
  useEffect(() => {
    getUsers();
  }, [skip]);

  return (
    <div>
      UserApprovePage
      {unApprovedProfiles &&
        unApprovedProfiles.map((user) => (
          <div key={user.id} className="border">
            <p>{user.initials}</p>
            <p>{user.statusFrom}</p>
            <p>{user.status}</p>
            <UserModal user={user} setStateUsers={setUnApprovedProfiles} stateUsers={unApprovedProfiles} />
          </div>
        ))}
      {end ? "You have reached the end" :
        <Button onClick={() => setSkip(skip + 10)}>Load More</Button>
      }
    </div>
  );
}
