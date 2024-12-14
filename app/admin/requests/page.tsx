// 'use client'
// import { useAuth } from '@/context/AuthProvider'
// import React, { useState } from 'react'

// export default function AdminRequestPage() {
//     // const uids = [...new Set(acceptedRequests.map(([, uid]) => uid))]; //get unique ids
//     const { getAllAccepted } = useAuth()
//     const [matchedData, setMatchedData] = useState<[string, string][]>([]);
//     const [matchedUID, setMatchedUID] = useState<string[]>([]);
//     async function getAcceptedUID() {
//         const matchedUsers = await getAllAccepted()
//         setMatchedData(matchedUsers); // Store the array of pairs in the state

//         // Extract unique UIDs from the array and update state
//         const allUIDs = matchedUsers.flatMap(([uid1, uid2]) => [uid1, uid2]);
//         const uniqueUIDs = Array.from(new Set(allUIDs)); // Get unique UIDs
//         setMatchedUID(uniqueUIDs);
//     }
//     return (
//         <div>
//             fetch get myrequested collection<br />
//             filter for status === "accepted"<br />
//             display users and a button to send email<br />
//             <br />
//             send email button will call the users private details fron "users" collection and create a mail template<br />
//             <br />
//             and db will be updated with each user having user.matched=[other user]<br />

//         </div>
//     )
// }
'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthProvider';

export default function AdminRequestPage() {
    // State variables
    const [matchedData, setMatchedData] = useState<[string, string][]>([]);
    const [matchedUID, setMatchedUID] = useState<string[]>([]);
    const [visibleUIDs, setVisibleUIDs] = useState<string[]>([]);
    const [profiles, setProfiles] = useState<Map<string, any>>(new Map()); // Stores profiles by UID
    const [loading, setLoading] = useState(false); // Flag for loading profiles
    const [hasMore, setHasMore] = useState(true); // Flag to check if more profiles need to be loaded

    const { getAllAccepted, getProfilebyUID } = useAuth(); // Assuming getProfilebyUID fetches profile details
    const loaderRef = useRef<HTMLDivElement>(null); // Reference for the scroll detection

    // Fetch all accepted requests and prepare data
    async function getAcceptedUID() {
        const matchedUsers = await getAllAccepted(); // Fetch data using the provided function
        setMatchedData(matchedUsers); // Store the array of pairs in state

        // Extract unique UIDs from both parts of each pair
        const allUIDs = matchedUsers.flatMap(([uid1, uid2]) => [uid1, uid2]);
        const uniqueUIDs = Array.from(new Set(allUIDs));
        setMatchedUID(uniqueUIDs); // Update state with unique UIDs
        console.log('matchedUID', matchedUID, matchedUsers);
    }

    // Fetch user profile details for a given UID
    const fetchProfiles = async (uids: string[]) => {
        setLoading(true);

        // For each UID, fetch profile details (check if already loaded)
        const newProfiles = new Map(profiles);
        for (let uid of uids) {
            if (!newProfiles.has(uid)) {
                const profileData = await getProfilebyUID(uid);
                newProfiles.set(uid, profileData);
            }
        }

        setProfiles(newProfiles); // Update profiles state
        setLoading(false);
    };

    // Load more profiles when scrolled to the bottom
    const handleScroll = () => {
        console.log('scroll');
        const bottom = loaderRef.current && loaderRef.current.getBoundingClientRect().bottom <= window.innerHeight;

        if (bottom && !loading && hasMore) {
            const nextVisibleUIDs = matchedUID.slice(visibleUIDs.length, visibleUIDs.length + 10); // Load 10 more
            setVisibleUIDs((prev) => [...prev, ...nextVisibleUIDs]);
        }
    };

    // Call this function when the component mounts
    useEffect(() => {
        getAcceptedUID();
    }, []);

    // Fetch profiles whenever visible UIDs change
    useEffect(() => {
        if (visibleUIDs.length > 0) {
            fetchProfiles(visibleUIDs);
        }
    }, [visibleUIDs]);

    // Detect scroll events
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [visibleUIDs, loading]);

    return (
        <div>
            <h1>Admin Request Page</h1>
            <h2>Matched Data:</h2>
            <div>
                {matchedData.map(([uid1, uid2], index) => (
                    <div key={index}>
                        <div>{uid1} ---- {uid2}</div>
                    </div>
                ))}
            </div>

            <h2>Profiles:</h2>
            <div>
                {visibleUIDs.map((uid, index) => {
                    const profile = profiles.get(uid);
                    return (
                        <div key={index}>
                            <div>{uid}</div>
                            {profile ? (
                                <div>
                                    {/* Assuming the profile has name and other fields */}
                                    <p>Name: {profile.name}</p>
                                    <p>Email: {profile.email}</p>
                                    {/* Add other profile fields here */}
                                </div>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    );
                })}
            </div>

            {loading && <div>Loading more profiles...</div>}

            <div ref={loaderRef}></div> {/* Sentinel element for scroll detection */}
        </div>
    );
}
