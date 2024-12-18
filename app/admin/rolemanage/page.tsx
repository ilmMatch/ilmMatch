'use client';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import LoginModal from '@/components/LoginModal';
import { UserPrivate, UserProfile } from '@/types/firebase';
import { Button } from '@/components/ui/button';
import UserModal from '@/components/userModal';
import { toast } from 'sonner';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

export default function RoleManager() {
  const { currentUser, getProfiles, getPrivatebyUIDs } = useAuth();
  const [profiles, setProfiles] = useState<
    UserProfile[] | undefined
  >([]);
  const [privateInfo, setPrivateInfo] = useState<UserPrivate[]>([])
  const lastVisibleDoc = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);

  const [end, setEnd] = useState(false);
  async function getUsers() {
    const data = await getProfiles(10, lastVisibleDoc.current, 'requested');
    if (!data.success) {
      toast.error("Uh oh! Something went wrong.", {
        description: data.error,
      })
      return
    }
    if (data.data.length > 0) {
      lastVisibleDoc.current = data.lastVisibleDoc
    } else {
      setEnd(data.data?.length === 0); return
    }


    const uids: string[] = data.data?.map(profile => profile.id) || [];
    const result = await getPrivatebyUIDs(uids)

    if (!result.success) {
      toast.error("Uh oh! Something went wrong.", {
        description: result.error,
      })
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
  }, []);
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
        <Button onClick={() => getUsers()}>Load More</Button>
      }
    </div>
  );
}
