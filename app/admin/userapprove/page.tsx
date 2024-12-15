'use client';
import UserModal from '@/components/userModal';
import { useAuth } from '@/context/AuthProvider';
import { UserProfile } from '@/types/firebase';
import React, { useEffect, useState } from 'react';

export default function UserApprovePage() {
  const { getProfiles } = useAuth();
  const [unApprovedProfiles, setUnApprovedProfiles] = useState<
    UserProfile[] | undefined
  >([]);

  async function getUsers() {
    const data = await getProfiles(10, 'requested');
    if (!data.success) {
      console.log(data.error);
    }

    const profilesWithStatus = data.profiles?.map((profile) => ({
      ...profile,
      status: 'requested',
      statusFrom: 'adminApprove',
    }));
    setUnApprovedProfiles(profilesWithStatus);
  }
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      UserApprovePage
      {unApprovedProfiles &&
        unApprovedProfiles.map((user) => (
          <div key={user.id} className="border">
            <p>{user.initials}</p>
            <p>{user.statusFrom}</p>
            <p>{user.status}</p>
            <UserModal user={user} />
          </div>
        ))}
    </div>
  );
}
