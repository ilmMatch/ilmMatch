'use client';
import React, { use, useEffect, useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from '@nextui-org/react';
import { Button } from '@/components/ui/button';
import { RequestAction, UserPrivate, UserProfile } from '@/types/firebase';
import { BookmarkCheck, BookmarkIcon, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { Action } from '@/types';
import { badgeVariants } from './ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface UserModalProps {
    user: UserProfile;
    setStateUsers: (newData: UserProfile[]) => void;
    stateUsers: UserProfile[];
    privateInfo?: UserPrivate
}
export default function UserModal({ user, setStateUsers, stateUsers, privateInfo }: UserModalProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { currentUser, bookmarkUpdate, userDataPrivate, setUserDataPrivate } = useAuth();
    const [matched, setMatched] = useState<string | undefined>();
    const [bookmarking, setBookmarking] = useState<boolean>(false);
    async function handleBookMark(action: Action) {
        setBookmarking(true)
        const result = await bookmarkUpdate(user.id, action);
        if (result.success) {
            setBookmarking(false)
            toast.success("Success", {
                description: "Bookmarked State Changed",
            })
            return
        }
        console.log("error", result.error);
        setBookmarking(false)
        // add toast

    }

    useEffect(() => {
        if (userDataPrivate?.matched?.true?.includes(user.id)) {
            setMatched("Matched");
        }
        if (userDataPrivate?.matched?.false?.includes(user.id)) {
            setMatched("Matched before");
        }

    })
    if (!currentUser) return <>loading</>;
    return (
        <>
            <Button variant="outline" className="rounded-full" onClick={onOpen}>
                <ChevronRight className="h-4 w-4" />
            </Button>
            <Modal
                backdrop={'blur'}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement={'center'}
                scrollBehavior="inside"
                size="xl"
            >
                <ModalContent>
                    {(onClose: any) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex items-center">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={bookmarking}
                                        onClick={() =>
                                            handleBookMark(
                                                userDataPrivate?.bookmarks?.includes(user.id)
                                                    ? 'remove'
                                                    : 'add'
                                            )
                                        }
                                    >
                                        {userDataPrivate?.bookmarks?.includes(user.id) ? (
                                            <BookmarkCheck size={4} className="text-primary" />
                                        ) : (
                                            <BookmarkIcon size={4} className="text-primary" />
                                        )}
                                    </Button>
                                    <span> {user.initials}</span>
                                </div>
                                {(matched && !user.statusFrom?.includes('admin')) && <span
                                    className={cn(
                                        'absolute top-5 right-8 capitalize',
                                        matched === 'Matched' &&
                                        badgeVariants({ variant: 'approved' }),
                                        matched === 'Matched before' &&
                                        badgeVariants({ variant: 'notApproved' })
                                    )}
                                >
                                    {matched}
                                </span>}
                            </ModalHeader>
                            <ModalBody>
                                <ProfileContent profile={user} userPrivate={privateInfo} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="link" onClick={onClose}>
                                    Close
                                </Button>


                                <UserActionButtons
                                    currentUserUID={currentUser.uid}
                                    user={user}
                                    setStateUsers={setStateUsers}
                                    stateUsers={stateUsers}
                                // handleAction={handleProfileMatchRequest}
                                />
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

// ===================================================***************************************************
function ProfileContent({ profile, userPrivate }: { profile: UserProfile; userPrivate: UserPrivate | undefined }) {
    return (
        <div className="space-y-4">
            {(userPrivate && profile.statusFrom?.includes('admin')) &&
                <ProfileSection title="Private Information">
                    <ProfileItem label="Gender" value={profile.gender} />
                    <ProfileItem label="Nationality" value={profile.nationality} />
                    <ProfileItem label="Ethnicity" value={profile.ethnicity} />
                    <ProfileItem label="Age" value={calculateAge(profile.dob.seconds)} />
                    <ProfileItem label="Height" value={`${profile.height} cm`} />
                    <ProfileItem label="Build" value={profile.build} />
                </ProfileSection>
            }

            <ProfileSection title="Personal Information">
                <ProfileItem label="Gender" value={profile.gender} />
                <ProfileItem label="Nationality" value={profile.nationality} />
                <ProfileItem label="Ethnicity" value={profile.ethnicity} />
                <ProfileItem label="Age" value={calculateAge(profile.dob.seconds)} />
                <ProfileItem label="Height" value={`${profile.height} cm`} />
                <ProfileItem label="Build" value={profile.build} />
            </ProfileSection>

            <ProfileSection title="Religious Information">
                <ProfileItem label="Born" value={profile.born} />
                <ProfileItem label="Sect" value={profile.sect} />
                <ProfileItem label="Pray" value={profile.pray} />
                <ProfileItem label="Hijab" value={profile.hijab} />
                <ProfileItem label="Islamic Education" value={profile.islamicEducation} />
                <ProfileItem label="Scholars" value={profile.scholars} />
            </ProfileSection>

            <ProfileSection title="Education and Occupation">
                <ProfileItem label="Education" value={profile.education} />
                <ProfileItem label="Occupation" value={profile.occupation} />
                <ProfileItem label="Languages" value={profile.languages} />
            </ProfileSection>

            <ProfileSection title="Location">
                <ProfileItem label="Country Residing" value={profile.countryResiding} />
                <ProfileItem label="Country Moving" value={profile.countryMoving} />
                <ProfileItem label="Masjid Name" value={profile.masjidName} />
            </ProfileSection>

            <ProfileSection title="Marital Information">
                <ProfileItem label="Marital Status" value={profile.maritalStatus} />
                <ProfileItem label="Children" value={profile.childern} />
                <ProfileItem label="Polygamy" value={profile.polygamy} />
                <ProfileItem label="Preferred Spouse Age" value={profile.spouseAge} />
            </ProfileSection>

            <ProfileSection title="About">
                <p className="text-sm text-muted-foreground">{profile.briefAboutYou}</p>
            </ProfileSection>

            <ProfileSection title="Spouse Brief">
                <p className="text-sm text-muted-foreground">{profile.spouseBrief}</p>
            </ProfileSection>
        </div>
    )
}


function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h4 className="text-md font-semibold text-accent-foreground mb-2">{title}</h4>
            <div className="bg-secondary rounded-lg p-4 space-y-2">{children}</div>
        </div>
    )
}

function ProfileItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between">
            <span className="text-sm font-medium text-muted-foreground capitalize pr-2">{label}:</span>
            <span className="text-sm text-accent-foreground capitalize">{value}</span>
        </div>
    )
}

function calculateAge(dobSeconds: number): string {
    const dob = new Date(dobSeconds * 1000);
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
}


// ===================================================***************************************************
interface UserButtonStatusProps {
    currentUserUID: string;
    user: UserProfile;
    stateUsers: UserProfile[];
    setStateUsers: (newData: UserProfile[]) => void;
}

const UserActionButtons: React.FC<UserButtonStatusProps> = ({
    currentUserUID,
    user,
    stateUsers,
    setStateUsers,
}) => {
    const { approvalUpdate, requestsUpdate, getProfilebyUID, userDataPrivate, roleManager } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const sameGender = user.gender == userDataPrivate?.gender

    const updateUser = (state: string | undefined, statusFrom: string) => {
        const updatedUsers = stateUsers.map((stateUser) =>
            stateUser.id === user.id ? {
                ...stateUser,
                status: state,
                ...(state === undefined ? { statusFrom: undefined } : { statusFrom })
            } : stateUser
        );
        setStateUsers(updatedUsers);
    }
    const handleMyRequestsClick =
        (action: Action, state: RequestAction) => async () => {
            const requestedmeCollectionID = user.id;
            const myrequestedCollectionID = currentUserUID;
            setSubmitting(true);

            const result = await requestsUpdate(
                requestedmeCollectionID,
                myrequestedCollectionID,
                state,
                action
            );
            if (result.success) {


                updateUser(state, 'myrequests') //updates the setUsers in parent component
                toast.success("Success", {
                    description: action == "remove" ? "Request Cancelled" : state == "requested" ? "Request sent Successfully" : state == "rejected" ? "Rejected: user will be informed" : "Unmatched",
                })

                setSubmitting(false);
                return
            }
            toast.error("Uh oh! Something went wrong.", {
                description: result.error,
            })
            setSubmitting(false);
            return
        };

    const handleRequestedMeClick =
        (action: Action, state: RequestAction) => async () => {
            setSubmitting(true);
            const requestedmeCollectionID = currentUserUID;
            const myrequestedCollectionID = user.id;
            const result = await requestsUpdate(
                requestedmeCollectionID,
                myrequestedCollectionID,
                state,
                action
            );
            if (result.success) {
                updateUser(state, 'requestedMe')
                toast.success("Success", {
                    description: state == "accepted" ? "Request Accepted" : state == "rejected" ? "Rejected: user will be informed" : "Unmatched",
                })
                setSubmitting(false);
                return
            }
            toast.error("Uh oh! Something went wrong.", {
                description: result.error,
            })
            setSubmitting(false);
            return
        };


    const handleMatchedClick =
        (action: Action, state: RequestAction) => async () => {
            setSubmitting(true);
            const requestedmeCollectionID = currentUserUID;
            const myrequestedCollectionID = user.id;
            const result = await requestsUpdate(
                requestedmeCollectionID,
                myrequestedCollectionID,
                state,
                action
            );
            if (result.success) {
                updateUser(state, 'matched')
                toast.success("Success", {
                    description: state == "unmatched" && "Unmatched",
                })
                setSubmitting(false);
                return
            }
            toast.error("Uh oh! Something went wrong.", {
                description: result.error,
            })
            setSubmitting(false);
            return
        };

    const handleUserApproveClickAdmin = async (status: string) => {
        setSubmitting(true);
        const voidResult = await approvalUpdate(status, user.id);
        if (voidResult.success) {
            updateUser(status, 'adminApprove') //updates the setUsers in parent component
            toast.success("Success", {
                description: status == "approved" ? "User Profile Approved" : "User Profile not Approved",
            })
            setSubmitting(false);
            return
        }
        toast.error("Uh oh! Something went wrong.", {
            description: voidResult.error,
        })
        setSubmitting(false);
        return
    };


    const handleRole = async (role: string) => {
        setSubmitting(true);
        const voidResult = await roleManager(user.id, role);
        if (voidResult.success) {
            toast.success("Success", {
                description: "Role Updated",
            })
            updateUser(role, 'adminAssign')
            setSubmitting(false);
            return
        }
        toast.error("Uh oh! Something went wrong.", {
            description: voidResult.error,
        })
        setSubmitting(false);
        return
    }


    if (!user.status && !user.statusFrom && !sameGender) {
        return (
            <Button
                disabled={submitting}
                onClick={handleMyRequestsClick('add', 'requested')}
                variant="default"
            >
                {submitting && <Loader2 className="animate-spin" />}
                Request
            </Button>
        );
    }

    if (user.statusFrom === 'myrequests' && !sameGender) {
        if (user.status === 'rejected') {
            return (
                <Button
                    disabled={submitting}
                    variant="outline" className="text-destructive">
                    {submitting && <Loader2 className="animate-spin" />}
                    Rejected
                </Button>
            );
        }

        if (user.status === 'accepted') {
            return (
                <Button
                    disabled={submitting}
                    onClick={handleMyRequestsClick('add', 'unmatched')}
                    variant="destructive"
                >
                    {submitting && <Loader2 className="animate-spin" />}
                    Not Moving Forward
                </Button>
            );
        }

        if (user.status === 'unmatched') {
            return (
                <Button
                    disabled={submitting}
                    onClick={handleMyRequestsClick('add', undefined)}
                    variant="secondary"
                >
                    {submitting && <Loader2 className="animate-spin" />}
                    if still considering
                </Button>
            );
        }

        return (
            // requested and re-requested
            <Button
                disabled={submitting}
                onClick={handleMyRequestsClick('remove', undefined)}
                variant="destructive"
            >
                {submitting && <Loader2 className="animate-spin" />}
                Cancel Request
            </Button>
        );
    }

    if (user.statusFrom === 'requestedMe' && !sameGender) {
        if (user.status === 'rejected') {
            return (
                <>
                    <Button
                        disabled={submitting}
                        onClick={handleRequestedMeClick('add', 'accepted')}
                        variant="default"
                    >
                        {' '}
                        {/* // Re-request */}
                        {submitting && <Loader2 className="animate-spin" />}
                        Reconsider
                    </Button>
                </>
            );
        }

        if (user.status === 'accepted') {
            return (
                <Button
                    disabled={submitting}
                    onClick={handleRequestedMeClick('add', 'unmatched')}
                    variant="destructive"
                >
                    {submitting && <Loader2 className="animate-spin" />}
                    Not Moving Forward?
                </Button>
            );
        }

        if (user.status === 'unmatched') {
            return (
                <Button
                    disabled={submitting}
                    onClick={handleRequestedMeClick('add', 'accepted')}
                    variant="secondary"
                >
                    {submitting && <Loader2 className="animate-spin" />}
                    if still considering
                </Button>
            );
        }

        return (
            // requested and re-requested
            <>
                <Button
                    disabled={submitting}
                    onClick={handleRequestedMeClick('add', 'rejected')}
                    variant="destructive"
                >
                    {submitting && <Loader2 className="animate-spin" />}
                    Reject
                </Button>
                <Button
                    disabled={submitting}
                    onClick={handleRequestedMeClick('add', 'accepted')}
                    variant="default"
                >
                    {submitting && <Loader2 className="animate-spin" />}
                    Accept
                </Button>
            </>
        );
    }

    if (user.statusFrom === 'matched' && !sameGender) {
        return (
            <Button
                disabled={submitting}
                onClick={handleMatchedClick('remove', 'unmatched')}
                variant="destructive"
            >
                {submitting && <Loader2 className="animate-spin" />}
                Not Moving Forward?
            </Button>
        );
    }

    if (user.statusFrom === 'adminApprove') {
        if (user.status === 'requested') {
            return (
                <>
                    <Button
                        disabled={submitting}
                        onClick={() => handleUserApproveClickAdmin('notApproved')}
                        variant="destructive"
                    >
                        {submitting && <Loader2 className="animate-spin" />}
                        Reject
                    </Button>
                    <Button
                        disabled={submitting}
                        onClick={() => handleUserApproveClickAdmin('approved')}
                        variant="default"
                    >
                        {submitting && <Loader2 className="animate-spin" />}
                        Approve
                    </Button>
                </>
            );
        }
        if (user.status === 'approved') {
            return (
                <>
                    <Button
                        disabled={submitting}
                        onClick={() => handleUserApproveClickAdmin('notApproved')}
                        variant="destructive"
                    >
                        {submitting && <Loader2 className="animate-spin" />}
                        Cancel Approved | Block
                    </Button>
                </>
            );
        }
        if (user.status === 'notApproved') {
            return (
                <>
                    <Button
                        variant="secondary"
                    >
                        Not Requested
                    </Button>
                </>
            );
        }
    }


    if (user.statusFrom === 'adminAssign') {
        if (user.status === 'user') {
            return (
                <>
                    <Button
                        disabled={submitting}
                        onClick={() => handleRole('admin')}
                        variant="default"
                    >
                        {submitting && <Loader2 className="animate-spin" />}
                        Make Admin
                    </Button>
                </>
            );
        }
        if (user.status === 'admin') {
            return (
                <>
                    <Button
                        disabled={submitting}
                        onClick={() => handleRole('user')}
                        variant="destructive"
                    >
                        {submitting && <Loader2 className="animate-spin" />}
                        Remove Admin
                    </Button>
                </>
            );
        }
    }
    return <Button variant="secondary">No Action Available</Button>;
};
