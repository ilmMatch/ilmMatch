'use client';
import { Button } from '@/components/ui/button';
import UserModal from '@/components/userModal';
import { useAuth } from '@/context/AuthProvider';
import { UserPrivate, UserProfile } from '@/types/firebase';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function UserApprovePage() {
  const { getProfiles, getPrivatebyUIDs } = useAuth();
  const [unApprovedProfiles, setUnApprovedProfiles] = useState<
    UserProfile[] | undefined
  >([]);
  const [privateInfo, setPrivateInfo] = useState<UserPrivate[]>([])
  const [skip, setSkip] = useState(0);
  const [end, setEnd] = useState(false);

  async function getUsers() {
    const data = await getProfiles(10, skip, 'requested');
    if (!data.success) {
      toast.error("Uh oh! Something went wrong.", {
        description: data.error,
      })
      return
    }
    if (data.data?.length === 0) {
      setEnd(true);
      return
    }
    setSkip(skip + 10);
    const uids: string[] = []
    const profilesWithStatus = (data.data ?? []).map((profile) => {
      uids.push(profile.id);
      return {
        ...profile,
        status: 'requested',
        statusFrom: 'adminApprove',
      }
    });
    const result = await getPrivatebyUIDs(uids)
    if (!result.success) {
      toast.error("Uh oh! Something went wrong.", {
        description: result.error,
      })
      return
    }

    setUnApprovedProfiles(prevProfiles => [...(prevProfiles ?? []), ...profilesWithStatus]);
    setPrivateInfo(prevPrivateInfo => [...prevPrivateInfo, ...result.data])


  }
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      UserApprovePage
      {unApprovedProfiles &&
        unApprovedProfiles.map((user) => {
          const userPrivateInfo = privateInfo.find(
            (info) => info.id === user.id
          );
          return (<div key={user.id} className="border">
            <p>{user.initials}</p>
            <p>{user.statusFrom}</p>
            <p>{user.status}</p>
            {userPrivateInfo && <p>{userPrivateInfo.userName}</p>}
            <UserModal user={user} setStateUsers={setUnApprovedProfiles} stateUsers={unApprovedProfiles} privateInfo={userPrivateInfo} />
          </div>)
        })}
      {end ? "You have reached the end" :
        <Button onClick={() => getUsers()}>Load More</Button>
      }
    </div>
  );
}
