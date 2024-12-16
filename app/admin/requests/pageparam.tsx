'use client'
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthProvider';
import React, { useEffect, useState } from 'react'

export default function AdminRequestPage() {
    const { getAllAccepted, getProfilebyUID, setMatchAdmin } = useAuth(); // Auth functions

    const [matchedData, setMatchedData] = useState<[string, string][]>([]); // Array of matched pairs
    const [profiles, setProfiles] = useState<Map<string, any>>(new Map()); // Stores profiles by UID
    const [skip, setSkip] = useState(0);
    const [end, setEnd] = useState(false);

    async function fetchMatchedData() {

        const data = await getAllAccepted(10, skip); // Fetch pairs of matched UIDs
        if (data.success) {
            setMatchedData(prevData => [...(prevData ?? []), ...data.data]);
            setEnd(data.data.length < 10);
            fetchProfilesForPairs(data.data)
        } else {
            console.log(data.error);
            // add toast
        }
    }

    async function fetchProfilesForPairs(pairs: [string, string][]) {

        const newProfiles = new Map(profiles);
        for (let [uid1, uid2] of pairs) {
            if (!newProfiles.has(uid1)) {
                const data = await getProfilebyUID(uid1);
                if (!data.success) {
                    console.log(data.error);
                    // add toast no need for console
                    continue;
                }
                newProfiles.set(uid1, data.data);
            }
            if (!newProfiles.has(uid2)) {
                const data = await getProfilebyUID(uid2);
                if (!data.success) {
                    console.log(data.error);
                    // add toast no need for console
                    continue;
                }
                newProfiles.set(uid2, data.data);
            }
        }

        setProfiles(newProfiles);
    }


    useEffect(() => {
        fetchMatchedData();
    }, [skip]);

    return (
        <div>
            {matchedData.map(([uid1, uid2], index) => {
                const profile1 = profiles.get(uid1);
                const profile2 = profiles.get(uid2);
                return (
                    <div key={index} className="border p-2">
                        {profile1 && profile2 ? (
                            <div>
                                <p>
                                    <pre>{JSON.stringify(profile1, null, 2)}</pre>
                                    {profile1.userName} -- {profile1.email} --
                                </p>
                                <p>
                                    {profile2.userName} -- {profile2.email} --
                                </p>
                                {/* Add other profile fields here */}
                                <Button
                                    onClick={() => sendEmail(profile1, uid1, profile2, uid2)}
                                >
                                    Send Email
                                </Button>
                            </div>
                        ) : (
                            <p>Loading profiles...</p>
                        )}
                    </div>
                );
            })}


            end? "You have reached the end":
            <Button onClick={() => setSkip(skip + 10)}>Load More</Button>
                }
        </div>
    )
}

