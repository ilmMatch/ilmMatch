'use client';
import { useAuth } from '@/context/AuthProvider';
import { FilterOptions, UserProfile } from '@/types/firebase';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DocumentData, limit, QueryDocumentSnapshot } from 'firebase/firestore';
import ProfileCard from '@/components/cards/profileCard';
import { FilterModal } from '@/components/modals/filterModal';
export default function FindPage() {
  const {
    getProfiles,
    currentUser,
    getRequestedMe,
    getMyRequested,
    userDataPrivate,
  } = useAuth();
  const [users, setUsers] = useState<UserProfile[] | undefined>([]);
  const [end, setEnd] = useState(false);
  const [limit, setLimit] = useState<number>(10);
  const [filters, setFilters] = useState<FilterOptions>({
    approved: 'approved',
    matched: 'notmatched',
    gender: userDataPrivate?.gender === 'brother' ? 'sister' : 'brother',
  });
  const lastVisibleDoc = useRef<QueryDocumentSnapshot<DocumentData> | null>(
    null
  );

  async function applyFilterClick() { lastVisibleDoc.current = null; setUsers([]); getUsers(); }

  async function getUsers() {
    if (!currentUser || !userDataPrivate) return 'you must be logged in';
    const data = await getProfiles(limit, lastVisibleDoc.current, filters);
    if (!data.success) {
      toast.error('Uh oh! Something went wrong.', {
        description: data.error,
      });
      return;
    }
    const myrequests = await getMyRequested(currentUser?.uid);
    if (!myrequests.success) {
      toast.error('Uh oh! Something went wrong.', {
        description: myrequests.error,
      });
      return;
    }

    const requestedMe = await getRequestedMe(currentUser.uid);
    if (!requestedMe.success) {
      toast.error('Uh oh! Something went wrong.', {
        description: requestedMe.error,
      });
      return;
    }

    const profilesWithStatus = data.data?.map((profile) => {
      const requestedStatus =
        requestedMe.data[profile.id as keyof typeof requestedMe.data];
      const myRequestStatus =
        myrequests.data[profile.id as keyof typeof myrequests.data];
      const matched = userDataPrivate?.matched?.true?.includes(profile.id);

      return {
        ...profile,
        status: requestedStatus
          ? requestedStatus.toString()
          : myRequestStatus
            ? myRequestStatus.toString()
            : matched
              ? 'matched'
              : undefined,
        statusFrom: requestedStatus
          ? 'requestedMe'
          : myRequestStatus
            ? 'myrequests'
            : matched
              ? 'matched'
              : undefined,
      };
    });

    data.data.length > 0 && (lastVisibleDoc.current = data.lastVisibleDoc)
    setEnd(profilesWithStatus?.length === 0);
    setUsers((prevData) => [...(prevData ?? []), ...profilesWithStatus]);
  }

  useEffect(() => {
    getUsers();
  }, [currentUser]);

  return (
    <div>
      <FilterModal filters={filters} setFilters={setFilters} applyFilterClick={applyFilterClick} />
      {users &&
        users.map((user) => (
          <div key={user.id}>
            <ProfileCard
              user={user}
              setStateUsers={setUsers}
              stateUsers={users}
            />
            {/* <UserModal user={user} setStateUsers={setUsers} stateUsers={users} /> */}
          </div>
        ))}
      {end ? (
        "You've reached the end"
      ) : (
        <Button onClick={() => getUsers()}>Load More</Button>
      )}
    </div>
  );
}
