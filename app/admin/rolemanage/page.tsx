'use client';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import LoginModal from '@/components/modals/LoginModal';
import { FilterOptions, UserPrivate, UserProfile } from '@/types/firebase';
import { Button } from '@/components/ui/button';
import UserModal from '@/components/modals/userModal';
import { toast } from 'sonner';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import VolunteerApprovalCard from '@/components/cards/volunteerApprovalCard';
import { FilterModal } from '@/components/modals/filterModal';
import { LoaderCircle } from 'lucide-react';

export default function RoleManager() {
  const { getProfiles, getPrivatebyUIDs } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[] | undefined>([]);
  const [privateInfo, setPrivateInfo] = useState<UserPrivate[]>([]);
  const lastVisibleDoc = useRef<QueryDocumentSnapshot<DocumentData> | null>(
    null
  );
  const [filters, setFilters] = useState<FilterOptions>({});
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState(false);


  const [end, setEnd] = useState(false);

  async function applyFilterClick() { lastVisibleDoc.current = null; setProfiles([]); setPrivateInfo([]); getUsers(); }

  async function getUsers() {
    setLoading(true)
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
    setLoading(false)
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <div className='flex justify-end w-full max-md:max-w-3xl md:w-4/5'>
        <FilterModal filters={filters} setFilters={setFilters} applyFilterClick={applyFilterClick} />
      </div>
      {profiles?.map((user) => {
        const userPrivateInfo = privateInfo.find((info) => info.id === user.id);

        return userPrivateInfo ? (
          <VolunteerApprovalCard
            key={user.id}
            user={user}
            setStateUsers={setProfiles}
            stateUsers={profiles}
            privateInfo={userPrivateInfo}
          />
        ) : null;
      })}


      <div className='w-full text-center'>
        {end ? (
          "You've reached the end"
        ) : (
          <Button onClick={() => getUsers()} disabled={loading}>{loading ? <span className='flex gap-2 mx-auto'><LoaderCircle className='animate-spin' /> Loading...</span> : "Load More"}</Button>
        )}
      </div>
    </div>
  );
}
