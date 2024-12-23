'use client';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import LoginModal from '@/components/LoginModal';
import { FilterOptions, UserPrivate, UserProfile } from '@/types/firebase';
import { Button } from '@/components/ui/button';
import UserModal from '@/components/userModal';
import { toast } from 'sonner';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import AdminApprovalCard from '@/components/cards/adminApprovalCard';
import { FilterModal } from '@/components/filterModal';

export default function RoleManager() {
  const { getProfiles, getPrivatebyUIDs } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[] | undefined>([]);
  const [privateInfo, setPrivateInfo] = useState<UserPrivate[]>([]);
  const lastVisibleDoc = useRef<QueryDocumentSnapshot<DocumentData> | null>(
    null
  );
  const [filters, setFilters] = useState<FilterOptions>({});

  const [end, setEnd] = useState(false);
  async function getUsers() {
    const data = await getProfiles(
      10,
      lastVisibleDoc.current,
      'requested',
      filters
    );
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

    const uids: string[] = data.data?.map((profile) => profile.id) || [];
    const result = await getPrivatebyUIDs(uids);

    if (!result.success) {
      toast.error('Uh oh! Something went wrong.', {
        description: result.error,
      });
      return;
    }

    const profilesWithStatus: UserProfile[] = (data.data ?? []).map(
      (profile) => {
        const matchingProfile = result.data?.find(
          (profileP) => profileP.id === profile.id
        );
        return matchingProfile
          ? {
              ...profile,
              status: matchingProfile.role,
              statusFrom: 'adminAssign',
            }
          : profile;
      }
    );

    setPrivateInfo((prevPrivateInfo) => [...prevPrivateInfo, ...result.data]);
    setProfiles((prevProfiles) => [
      ...(prevProfiles ?? []),
      ...profilesWithStatus,
    ]);
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <FilterModal filters={filters} setFilters={setFilters} />
      {profiles &&
        profiles.map((user) => {
          const userPrivateInfo = privateInfo.find(
            (info) => info.id === user.id
          );
          return (
            <div key={user.id}>
              {userPrivateInfo && (
                <AdminApprovalCard
                  user={user}
                  setStateUsers={setProfiles}
                  stateUsers={profiles}
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
