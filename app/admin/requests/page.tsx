'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';

export default function AdminRequestPage() {
    // State variables
    const [matchedData, setMatchedData] = useState<[string, string][]>([]); // Array of matched pairs
    const [visiblePairs, setVisiblePairs] = useState<[string, string][]>([]); // Pairs currently displayed
    const [profiles, setProfiles] = useState<Map<string, any>>(new Map()); // Stores profiles by UID
    const [loading, setLoading] = useState(false); // Flag for loading profiles
    const [hasMore, setHasMore] = useState(true); // Flag to check if more pairs need to be loaded

    const { getAllAccepted, getProfilebyUID } = useAuth(); // Auth functions
    const loaderRef = useRef<HTMLDivElement>(null); // Reference for scroll detection

    // Fetch all matched pairs
    async function fetchMatchedData() {
        const matchedUsers = await getAllAccepted(); // Fetch pairs of matched UIDs
        setMatchedData(matchedUsers);

        // Initialize with the first 10 pairs
        const initialPairs = matchedUsers.slice(0, 10);
        setVisiblePairs(initialPairs);
        setHasMore(matchedUsers.length > 10); // Check if more pairs are available
    }

    // Fetch user profiles for UIDs in the pairs
    async function fetchProfilesForPairs(pairs: [string, string][]) {
        setLoading(true);

        const newProfiles = new Map(profiles);
        for (let [uid1, uid2] of pairs) {
            // Fetch profiles only if not already loaded
            if (!newProfiles.has(uid1)) {
                const profile1 = await getProfilebyUID(uid1);
                newProfiles.set(uid1, profile1);
            }
            if (!newProfiles.has(uid2)) {
                const profile2 = await getProfilebyUID(uid2);
                newProfiles.set(uid2, profile2);
            }
        }

        setProfiles(newProfiles);
        setLoading(false);
    }

    // Load more pairs when scrolled to the bottom
    const loadMorePairs = () => {
        if (loading || !hasMore) return; // Prevent multiple fetches

        const nextPairs = matchedData.slice(visiblePairs.length, visiblePairs.length + 10); // Get the next 10 pairs
        if (nextPairs.length === 0) {
            setHasMore(false); // No more pairs to load
        } else {
            setVisiblePairs((prev) => [...prev, ...nextPairs]);
        }
    };

    // Detect scroll events to trigger loading more pairs
    const handleScroll = () => {
        const bottom =
            loaderRef.current && loaderRef.current.getBoundingClientRect().bottom <= window.innerHeight;
        if (bottom) {
            loadMorePairs();
        }
    };

    // Initialize matched pairs on component mount
    useEffect(() => {
        fetchMatchedData();
    }, []);

    // Fetch profiles whenever visible pairs change
    useEffect(() => {
        if (visiblePairs.length > 0) {
            fetchProfilesForPairs(visiblePairs);
        }
    }, [visiblePairs]);

    // Attach scroll listener
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [visiblePairs, loading]);

    return (
        <div>
            <h1>Admin Request Page</h1>

            <h2>Matched Data:</h2>
            <div>
                {visiblePairs.map(([uid1, uid2], index) => {
                    const profile1 = profiles.get(uid1);
                    const profile2 = profiles.get(uid2);
                    const brother = profile1.gender === "brother" ? profile1 : profile2;
                    const sister = profile1.gender === "sister" ? profile1 : profile2;


                    return (
                        <div key={index} className="border p-2">
                            {profile1 && profile2 ? (
                                <div>
                                    <p>
                                        {brother.userName} -- {brother.email} -- {brother.gender}
                                    </p>
                                    <p>
                                        {sister.userName} -- {sister.email} -- {sister.gender}
                                    </p>
                                    {/* Add other profile fields here */}
                                    <Button>Send Email</Button>
                                </div>
                            ) : (
                                <p>Loading profiles...</p>
                            )}
                        </div>
                    );
                })}
            </div>

            {loading && <div>Loading more profiles...</div>}

            {!hasMore && <div>You reached the end.</div>}

            <div ref={loaderRef}></div> {/* Sentinel element for scroll detection */}
        </div>
    );
}
