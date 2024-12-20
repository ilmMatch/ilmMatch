'use client';
import { useAuth } from '@/context/AuthProvider';
import { UserProfile } from '@/types/firebase';
import React, { useEffect, useRef, useState } from 'react';
import UserModal from '@/components/userModal';
import { Button } from '@/components/ui/button';
import { toast } from "sonner"
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import ProfileCard from '@/components/profileCard';
export default function FindPage() {
  const {
    getProfiles,
    currentUser,
    getRequestedMe,
    getMyRequested,
  } = useAuth();
  const [users, setUsers] = useState<UserProfile[] | undefined>([]);
  const [end, setEnd] = useState(false);
  const lastVisibleDoc = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);

  async function getUsers() {
    if (!currentUser) return 'you must be logged in';

    const data = await getProfiles(10, lastVisibleDoc.current, 'approved');
    if (!data.success) {
      console.log(data.error);
      toast.error("Uh oh! Something went wrong.", {
        description: data.error,
        action: {
          label: "close",
          onClick: () => console.log("close"),
        },
      })
      return;
    }
    console.log(data.data)
    const myrequests = await getMyRequested(currentUser?.uid);
    if (!myrequests.success) {
      toast.error("Uh oh! Something went wrong.", {
        description: myrequests.error,
        action: {
          label: "close",
          onClick: () => console.log("close"),
        },
      })
      return;
    }

    const requestedMe = await getRequestedMe(currentUser.uid);
    if (!requestedMe.success) {
      toast.error("Uh oh! Something went wrong.", {
        description: requestedMe.error,
        action: {
          label: "close",
          onClick: () => console.log("close"),
        },
      })
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

    data.data.length > 0 ? lastVisibleDoc.current = data.lastVisibleDoc : setEnd(profilesWithStatus?.length === 0);
    setUsers(prevData => [...(prevData ?? []), ...profilesWithStatus]);
  }

  useEffect(() => {
    getUsers();
  }, [currentUser]);

  return (
    <div>
      {users &&
        users.map((user) => (
          <div key={user.id}>
            <ProfileCard user={user} setStateUsers={setUsers} stateUsers={users} />
            {/* <UserModal user={user} setStateUsers={setUsers} stateUsers={users} /> */}
          </div>
        ))}
      {end ? "You've reached the end" :
        <Button onClick={() => getUsers()}>Load More</Button>
      }
    </div>
  );
}
