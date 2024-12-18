'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminRequestPage() {
    // State variables
    const [matchedData, setMatchedData] = useState<[string, string][]>([]); // Array of matched pairs
    const [visiblePairs, setVisiblePairs] = useState<[string, string][]>([]); // Pairs currently displayed
    const [profiles, setProfiles] = useState<Map<string, any>>(new Map()); // Stores profiles by UID
    const [privateProfiles, setPrivateProfiles] = useState<Map<string, any>>(new Map()); // Stores profiles by UID
    const [loading, setLoading] = useState(false); // Flag for loading profiles
    const [hasMore, setHasMore] = useState(true); // Flag to check if more pairs need to be loaded

    const { getAllAccepted, getProfilebyUID, setMatchAdmin, getPrivatebyUID } = useAuth(); // Auth functions
    const loaderRef = useRef<HTMLDivElement>(null); // Reference for scroll detection

    // Fetch all matched pairs
    async function fetchMatchedData() {
        const data = await getAllAccepted(); // Fetch pairs of matched UIDs
        if (data.success) {
            setMatchedData(data.data);

            // Initialize with the first 10 pairs
            const initialPairs = data.data.slice(0, 10);
            setVisiblePairs(initialPairs);
            setHasMore(data.data.length > 10); // Check if more pairs are available
        } else {
            console.log(data.error); // add toast
        }
    }

    // Fetch user profiles for UIDs in the pairs
    async function fetchProfilesForPairs(pairs: [string, string][]) {
        setLoading(true);

        const newProfiles = new Map(profiles);
        const newPrivateProfiles = new Map(privateProfiles);
        for (let [uid1, uid2] of pairs) {
            // Fetch profiles only if not already loaded
            if (!newProfiles.has(uid1)) {
                const data = await getProfilebyUID(uid1);
                if (!data.success) {
                    toast.error("Uh oh! Something went wrong.", {
                        description: data.error,
                    })
                    continue;
                }
                newProfiles.set(uid1, data.data);
            }
            if (!newProfiles.has(uid2)) {
                const data = await getProfilebyUID(uid2);
                if (!data.success) {
                    toast.error("Uh oh! Something went wrong.", {
                        description: data.error,
                    })
                    continue;
                }
                newProfiles.set(uid2, data.data);
            }

            if (!newPrivateProfiles.has(uid1)) {
                const data = await getPrivatebyUID(uid1);
                if (!data.success) {
                    toast.error("Uh oh! Something went wrong.", {
                        description: data.error,
                    })
                    continue;
                }
                newPrivateProfiles.set(uid1, data.data);
            }
            if (!newPrivateProfiles.has(uid2)) {
                const data = await getPrivatebyUID(uid2);
                if (!data.success) {
                    toast.error("Uh oh! Something went wrong.", {
                        description: data.error,
                    })
                    continue;
                }
                newPrivateProfiles.set(uid2, data.data);
            }
        }

        setProfiles(newProfiles);
        setLoading(false);
    }

    // Load more pairs when scrolled to the bottom
    const loadMorePairs = () => {
        if (loading || !hasMore) return; // Prevent multiple fetches

        const nextPairs = matchedData.slice(
            visiblePairs.length,
            visiblePairs.length + 10
        ); // Get the next 10 pairs
        if (nextPairs.length === 0) {
            setHasMore(false); // No more pairs to load
        } else {
            setVisiblePairs((prev) => [...prev, ...nextPairs]);
        }
    };

    // Detect scroll events to trigger loading more pairs
    const handleScroll = () => {
        const bottom =
            loaderRef.current &&
            loaderRef.current.getBoundingClientRect().bottom <= window.innerHeight;
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

    async function sendEmail(
        brother: any,
        brotherUID: string,
        sister: any,
        sisterUID: string
    ) {
        const apiKey = process.env.NEXT_PUBLIC_MAIL_API_KEY;
        const url = process.env.NEXT_PUBLIC_MAIL_API_URL;
        if (!apiKey || !url) return;
        const emailData = {
            sender: { name: 'Admin', email: 'sayyedrahat721@gmail.com' },
            to: [
                { name: brother.userName, email: brother.email },
                { name: sister.userName, email: sister.email },
            ],
            subject: 'Ilm Match: Requested User Information',
            htmlContent: `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Family Details</title>
    <style>
        body {
            background-color: gold;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .brother,
        .sister,
        div {
            border: 1px solid black;
            padding: 10px;
            margin: 10px;
            border-radius: 5px;
        }
    </style>
</head>

<body>
    <div class="brother">
        <strong>Brother</strong>
        <div><b>Name:</b> ${brother.userName}</div>
        <div> <b>Contact:</b>${brother.mobileNumber}</div>
        <div> <b>Wali:</b>${brother.waliName ? brother.waliName : 'N/A'}</div>
        <div> <b>Contact:</b>${brother.waliMobileNumber ? brother.waliMobileNumber : 'N/A'}</div>
    </div>

    <div class="sister">
        <strong>Sister</strong>
        <div><b>Name:</b> ${sister.userName}</div>
        <div> <b>Contact:</b> ${sister.mobileNumber ? sister.mobileNumber : 'N/A'}</div>
        <div> <b>Wali:</b> ${sister.waliName}</div>
        <div><b>Contact:</b> ${sister.waliMobileNumber}</div>
    </div>
</body>

</html>`,
        };
        console.log('called', brother, sister);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': apiKey,
                },
                body: JSON.stringify(emailData),
            });
            if (response.status === 201) {
                toast.success("Success", {
                    description: "Email Sent Successfully",
                })
                const data = await setMatchAdmin(brotherUID, sisterUID);
                if (!data.success) {
                    toast.error("Uh oh! Something went wrong.", {
                        description: data.error,
                    })
                }
            } else {
                const error = await response.json();
                console.error('Error sending email:', error);
                toast.error("Uh oh! Email not sent.", {
                    description: error,
                })
            }
        } catch (err: unknown) {
            toast.error("Uh oh! Something went wrong.", {
                description: err instanceof Error ? err.message : "An error occurred while sending the email.",
            })
        }
    }

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
                    // const brother = profile1.gender === 'brother' ? profile1 : profile2;
                    // const sister = profile1.gender === 'sister' ? profile1 : profile2;

                    return (
                        <div key={index} className="border p-2">
                            {profile1 && profile2 ? (
                                <div>
                                    <p>
                                        {privateProfile1.userName} -- {privateProfile1.email} --
                                    </p>
                                    <p>
                                        {privateProfile2.userName} -- {privateProfile2.email} --
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
            </div>
            {loading && <div>Loading more profiles...</div>}
            {!hasMore && <div>You reached the end.</div>}
            <div ref={loaderRef}></div> {/* Sentinel element for scroll detection */}
        </div>
    );
}
