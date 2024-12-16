'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import LoginModal from '@/components/LoginModal';
import { UserPrivate, UserProfile } from '@/types/firebase';
import { Button } from '@/components/ui/button';
import UserModal from '@/components/userModal';

export default function RoleManager() {
  const { currentUser, roleManager, getProfiles, getPrivatebyUIDs } = useAuth();
  const [profiles, setProfiles] = useState<
    UserProfile[] | undefined
  >([]);
  const [privateInfo, setPrivateInfo] = useState<UserPrivate[]>([])
  const [skip, setSkip] = useState(0);
  const [end, setEnd] = useState(false);
  async function getUsers() {
    const data = await getProfiles(10, skip, 'requested');
    if (!data.success) {
      console.log(data.error);
      // add toast
      return
    }
    if (data.data?.length === 0) {
      console.log("no data");
      // add toast
      return
    }


    const isEnd = data.data ? data.data.length < 10 : true
    setEnd(isEnd);

    const uids: string[] = data.data?.map(profile => profile.id) || [];
    const result = await getPrivatebyUIDs(uids)

    if (!result.success) {
      console.log(result.error);
      // add toast
      return
    }

    const profilesWithStatus: UserProfile[] = (data.data ?? []).map((profile) => {
      const matchingProfile = result.data?.find(profileP => profileP.id === profile.id);
      return matchingProfile ? {
        ...profile, status: matchingProfile.role,
        statusFrom: "adminAssign",
      } : profile

    });

    setPrivateInfo(prevPrivateInfo => [...prevPrivateInfo, ...result.data]);
    setProfiles(prevProfiles => [...(prevProfiles ?? []), ...profilesWithStatus]);
  }

  useEffect(() => {
    getUsers();
  }, [skip]);
  // const handleAssignRole = async () => {
  //   setLoading(true);
  //   try {
  //     await roleManager(userId, role);
  //   } catch (err: any) {
  //     console.log(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (!currentUser) {
    return <LoginModal />;
  }
  return (
    <div>
      {profiles &&
        profiles.map((user) => {
          const userPrivateInfo = privateInfo.find(
            (info) => info.id === user.id
          );
          return (<div key={user.id} className="border">
            <p>{user.initials}</p>
            <p>{user.statusFrom}</p>
            <p>{user.status}</p>
            {userPrivateInfo && <p>{userPrivateInfo.userName}</p>}
            <UserModal user={user} setStateUsers={setProfiles} stateUsers={profiles} privateInfo={userPrivateInfo} />
          </div>)
        })}
      {end ? "You have reached the end" :
        <Button onClick={() => setSkip(skip + 10)}>Load More</Button>
      }
    </div>
  );
}
