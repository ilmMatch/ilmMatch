'use client';
import { useAuth } from '@/context/AuthProvider';
import { FilterOptions, UserProfile } from '@/types/firebase';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { FilterModal } from '@/components/modals/filterModal';
import ProfileCard from '@/components/cards/profileCardNoLogin';
import { LoaderCircle } from 'lucide-react';
export default function ProfilesPage() {
    const { getProfiles } = useAuth();
    const [users, setUsers] = useState<UserProfile[] | undefined>([]);
    const [end, setEnd] = useState(false);
    const [limit, setLimit] = useState<number>(10);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({
        approved: 'approved',
        matched: 'notmatched',
    });
    const lastVisibleDoc = useRef<QueryDocumentSnapshot<DocumentData> | null>(
        null
    );

    async function applyFilterClick() { lastVisibleDoc.current = null; setUsers([]); getUsers(); }

    async function getUsers() {
        setLoading(true);
        const data = await getProfiles(limit, lastVisibleDoc.current, filters);
        if (!data.success) {
            toast.error('Uh oh! Something went wrong.', {
                description: data.error,
            });
            return;
        }

        data.data.length > 0 && (lastVisibleDoc.current = data.lastVisibleDoc)
        setEnd(data.data?.length === 0);
        setUsers((prevData) => [...(prevData ?? []), ...data.data]);
        setLoading(false);
    }

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div>
            <div className='flex justify-end w-full max-md:max-w-3xl md:w-4/5'>
                <FilterModal filters={filters} setFilters={setFilters} applyFilterClick={applyFilterClick} />
            </div>
            {users &&
                users.map((user) => (
                    <div key={user.id}>
                        <ProfileCard
                            user={user}
                        />
                    </div>
                ))}
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
