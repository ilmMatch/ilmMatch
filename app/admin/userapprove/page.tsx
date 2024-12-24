'use client';
import AdminApprovalCard from '@/components/cards/adminApprovalCard';
import { FilterModal } from '@/components/modals/filterModal';
import { Button } from '@/components/ui/button';
import UserModal from '@/components/modals/userModal';
import { useAuth } from '@/context/AuthProvider';
import { FilterOptions, UserPrivate, UserProfile } from '@/types/firebase';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function UserApprovePage() {
  const { getProfiles, getPrivatebyUIDs } = useAuth();
  const [unApprovedProfiles, setUnApprovedProfiles] = useState<
    UserProfile[] | undefined
  >([]);
  const [filters, setFilters] = useState<FilterOptions>({
    approved: 'requested',
  });
  const [limit, setLimit] = useState<number>(10);
  const [privateInfo, setPrivateInfo] = useState<UserPrivate[]>([]);
  const lastVisibleDoc = useRef<QueryDocumentSnapshot<DocumentData> | null>(
    null
  );

  const [end, setEnd] = useState(false);

  async function applyFilterClick() { lastVisibleDoc.current = null; setUnApprovedProfiles([]); setPrivateInfo([]); getUsers(); }
  async function getUsers() {
    const data = await getProfiles(limit, lastVisibleDoc.current, filters);
    if (!data.success) {
      toast.error('Uh oh! Something went wrong.', {
        description: data.error,
      });
      return;
    }
    if (data.data.length > 0) {
      lastVisibleDoc.current = data.lastVisibleDoc;
    } else {
      setEnd(data.data?.length === 0);
      return;
    }

    const uids: string[] = [];
    const profilesWithStatus = (data.data ?? []).map((profile) => {
      uids.push(profile.id);
      return {
        ...profile,
        status: 'requested',
        statusFrom: 'adminApprove',
      };
    });
    const result = await getPrivatebyUIDs(uids);
    if (!result.success) {
      toast.error('Uh oh! Something went wrong.', {
        description: result.error,
      });
      return;
    }

    setUnApprovedProfiles((prevProfiles) => [
      ...(prevProfiles ?? []),
      ...profilesWithStatus,
    ]);
    setPrivateInfo((prevPrivateInfo) => [...prevPrivateInfo, ...result.data]);
  }
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      UserApprovePage
      <FilterModal filters={filters} setFilters={setFilters} applyFilterClick={applyFilterClick} />
      {unApprovedProfiles &&
        unApprovedProfiles.map((user) => {
          const userPrivateInfo = privateInfo.find(
            (info) => info.id === user.id
          );
          console.log(userPrivateInfo, user);
          return (
            <div key={user.id}>
              {userPrivateInfo && (
                <AdminApprovalCard
                  user={user}
                  setStateUsers={setUnApprovedProfiles}
                  stateUsers={unApprovedProfiles}
                  privateInfo={userPrivateInfo}
                />
              )}
            </div>
          );
        })}
      {end ? (
        'You have reached the end'
      ) : (
        <Button onClick={() => getUsers()}>Load More</Button>
      )}
    </div>
  );
}
