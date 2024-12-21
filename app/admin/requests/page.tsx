'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import MatchProfilesComponent from '@/components/cards/requestMatchCard';
import { UserPrivate } from '@/types/firebase';
import { sendEmail } from './sendEmail';

export default function AdminRequestPage() {
  const [matchedData, setMatchedData] = useState<[string, string][]>([]);
  const [visiblePairs, setVisiblePairs] = useState<[string, string][]>([]);
  const [profiles, setProfiles] = useState<Map<string, any>>(new Map());
  const [privateProfiles, setPrivateProfiles] = useState<Map<string, any>>(
    new Map()
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { getAllAccepted, getProfilebyUID, setMatchAdmin, getPrivatebyUID } =
    useAuth();

  // Fetch all matched pairs
  async function fetchMatchedData() {
    const data = await getAllAccepted();
    if (data.success) {
      setMatchedData(data.data);

      // Initialize with the first 10 pairs
      const initialPairs = data.data.slice(0, 10);
      setVisiblePairs(initialPairs);
      setHasMore(data.data.length > 10);
    } else {
      console.log(data.error);
    }
  }

  // Fetch user profiles for UIDs in the pairs
  async function fetchProfilesForPairs(pairs: [string, string][]) {
    setLoading(true);

    const newProfiles = new Map(profiles);
    const newPrivateProfiles = new Map(privateProfiles);
    for (let [uid1, uid2] of pairs) {
      if (!newProfiles.has(uid1)) {
        const data = await getProfilebyUID(uid1);
        if (!data.success) {
          toast.error('Uh oh! Something went wrong.', {
            description: data.error,
          });
          continue;
        }
        const profileWithStatus = { ...data.data, statusFrom: 'adminRequests' };
        newProfiles.set(uid1, profileWithStatus);
      }
      if (!newProfiles.has(uid2)) {
        const data = await getProfilebyUID(uid2);
        if (!data.success) {
          toast.error('Uh oh! Something went wrong.', {
            description: data.error,
          });
          continue;
        }
        const profileWithStatus = { ...data.data, statusFrom: 'adminRequests' };
        newProfiles.set(uid2, profileWithStatus);
      }

      if (!newPrivateProfiles.has(uid1)) {
        const data = await getPrivatebyUID(uid1);
        if (!data.success) {
          toast.error('Uh oh! Something went wrong.', {
            description: data.error,
          });
          continue;
        }
        newPrivateProfiles.set(uid1, data.data);
      }
      if (!newPrivateProfiles.has(uid2)) {
        const data = await getPrivatebyUID(uid2);
        if (!data.success) {
          toast.error('Uh oh! Something went wrong.', {
            description: data.error,
          });
          continue;
        }
        newPrivateProfiles.set(uid2, data.data);
      }
    }

    setProfiles(newProfiles);
    setPrivateProfiles(newPrivateProfiles);
    setLoading(false);
  }

  const loadMorePairs = () => {
    if (loading || !hasMore) return;

    const nextPairs = matchedData.slice(
      visiblePairs.length,
      visiblePairs.length + 10
    );
    if (nextPairs.length === 0) {
      setHasMore(false);
    } else {
      setVisiblePairs((prev) => [...prev, ...nextPairs]);
    }
  };

  useEffect(() => {
    fetchMatchedData();
  }, []);

  useEffect(() => {
    if (visiblePairs.length > 0) {
      fetchProfilesForPairs(visiblePairs);
    }
  }, [visiblePairs]);

  const handleMatchClick = async (
    brother: UserPrivate,
    sister: UserPrivate
  ) => {
    const data = await setMatchAdmin(brother.id, sister.id);
    if (!data.success) {
      toast.error('Uh oh! Something went wrong.', {
        description: data.error,
      });
      return;
    }
    await sendEmail(brother, sister);
    removePair(brother.id, sister.id);
  };

  const removePair = (uid1: string, uid2: string) => {
    // Remove from matchedData
    const updatedMatchedData = matchedData.filter(
      ([id1, id2]) => !(id1 === uid1 && id2 === uid2)
    );
    setMatchedData(updatedMatchedData);

    // Remove from visiblePairs
    const updatedVisiblePairs = visiblePairs.filter(
      ([id1, id2]) => !(id1 === uid1 && id2 === uid2)
    );
    setVisiblePairs(updatedVisiblePairs);
  };

  return (
    <div>
      <h1>Admin Request Page</h1>
      <h2>Matched Data:</h2>
      <div>
        {visiblePairs.map(([uid1, uid2], index) => {
          const profile1 = profiles.get(uid1);
          const privateProfile1 = privateProfiles.get(uid1);
          const profile2 = profiles.get(uid2);
          const privateProfile2 = privateProfiles.get(uid2);

          return (
            <div key={index}>
              {profile1 && profile2 && privateProfile1 && privateProfile2 ? (
                <div>
                  <MatchProfilesComponent
                    profile1={profile1}
                    profile2={profile2}
                    privateInfo1={privateProfile1}
                    privateInfo2={privateProfile2}
                    handleMatchClick={handleMatchClick}
                  />
                </div>
              ) : (
                <p>Loading profiles...</p>
              )}
            </div>
          );
        })}
      </div>
      {loading && <div>Loading profiles...</div>}
      {hasMore && (
        <Button onClick={loadMorePairs} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </Button>
      )}
      {!hasMore && <div>You reached the end.</div>}
    </div>
  );
}
