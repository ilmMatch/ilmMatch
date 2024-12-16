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
import { RequestAction, UserProfile } from '@/types/firebase';
import { BookmarkCheck, BookmarkIcon, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { Action } from '@/types';
import { badgeVariants } from './ui/badge';
import { cn } from '@/lib/utils';

export default function UserModal({ user, setStateUsers, stateUsers }: { user: UserProfile, setStateUsers: (newData: UserProfile[]) => void, stateUsers: UserProfile[]; }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { currentUser, bookmarkUpdate, userDataPrivate, setUserDataPrivate } = useAuth();
    const [matched, setMatched] = useState<string | undefined>();
    const [bookmarking, setBookmarking] = useState<boolean>(false);
    async function handleBookMark(action: Action) {
        setBookmarking(true)
        const result = await bookmarkUpdate(user.id, action);
        if (result.success) {
            setBookmarking(false)
            // add success toast
            return
        }
        console.log("error", result.error);
        setBookmarking(false)
        // add toast

    }

    useEffect(() => {
        if (userDataPrivate?.matched?.includes(user.id)) {
            setMatched("Matched");
        }
        if (userDataPrivate?.unmatched?.includes(user.id)) {
            setMatched("Matched before");
        }

    })
    if (!currentUser) return <>loading</>;
    return (
        <>
            <Button onClick={onOpen}>Open Profile</Button>
            <Modal
                backdrop={'blur'}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement={'center'}
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
                                {matched && <span
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
                                <>{JSON.stringify(user, null, 2)}</>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="link" onClick={onClose}>
                                    Close
                                </Button>

                                <UserActionButtons
                                    status={user.status}
                                    statusFrom={user.statusFrom}
                                    currentUserUID={currentUser.uid}
                                    userUID={user.id}
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

interface UserButtonStatusProps {
    status?: string;
    statusFrom?: string;
    currentUserUID: string;
    userUID: string;
    stateUsers: UserProfile[];
    setStateUsers: (newData: UserProfile[]) => void;
    // handleAction: (
    //     requestedmeCollectionID: string,
    //     myrequestedCollectionID: string,
    //     action: Action,
    //     state: RequestAction
    // ) => Promise<void>;
}
// ===================================================***************************************************

const UserActionButtons: React.FC<UserButtonStatusProps> = ({
    status,
    statusFrom,
    currentUserUID,
    userUID,
    stateUsers,
    setStateUsers,
}) => {
    const { approvalUpdate, requestsUpdate, getProfilebyUID } = useAuth();
    const [submitting, setSubmitting] = useState(false);

    const updateUser = (state: string | undefined, statusFrom: string) => {
        const updatedUsers = stateUsers.map((user) =>
            user.id === userUID ? {
                ...user,
                status: state,
                ...(state === undefined && { statusFrom: undefined })
            } : user
        );
        console.log("updatedUsers", updatedUsers)
        setStateUsers(updatedUsers);

    }
    const handleMyRequestsClick =
        (action: Action, state: RequestAction) => async () => {
            const requestedmeCollectionID = userUID;
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
                // add success toast
                setSubmitting(false);
                return
            }
            console.log("error", result.error);
            // add toast
            setSubmitting(false);
            return
        };

    const handleRequestedMeClick =
        (action: Action, state: RequestAction) => async () => {
            setSubmitting(true);
            const requestedmeCollectionID = currentUserUID;
            const myrequestedCollectionID = userUID;
            const result = await requestsUpdate(
                requestedmeCollectionID,
                myrequestedCollectionID,
                state,
                action
            );
            if (result.success) {
                updateUser(state, 'requestedMe')
                // add success toast
                setSubmitting(false);
                return
            }
            console.log("error", result.error);
            // add toast
            setSubmitting(false);
            return
        };

    const handleUserApproveClickAdmin = async (status: string) => {
        setSubmitting(true);
        const voidResult = await approvalUpdate(status, userUID);
        if (voidResult.success) {
            updateUser(status, 'adminApprove') //updates the setUsers in parent component
            // add success toast
            setSubmitting(false);
            return
        }
        console.log("error", voidResult.error);
        // add toast
        setSubmitting(false);
        return
    };

    if (!status && !statusFrom) {
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

    if (statusFrom === 'myrequests') {
        if (status === 'rejected') {
            return (
                <Button
                    disabled={submitting}
                    variant="outline" className="text-destructive">
                    {submitting && <Loader2 className="animate-spin" />}
                    Rejected
                </Button>
            );
        }

        if (status === 'accepted') {
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

        if (status === 'unmatched') {
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

    if (statusFrom === 'requestedMe') {
        if (status === 'rejected') {
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

        if (status === 'accepted') {
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

        if (status === 'unmatched') {
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

    if (statusFrom === 'matched') {
        return (
            <Button
                disabled={submitting}
                onClick={handleRequestedMeClick('remove', 'unmatched')}
                variant="destructive"
            >
                {submitting && <Loader2 className="animate-spin" />}
                Not Moving Forward?
            </Button>
        );
    }

    if (statusFrom === 'adminApprove') {
        if (status === 'requested') {
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
        if (status === 'approved') {
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
        if (status === 'notApproved') {
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
    return <Button variant="secondary">No Action Available</Button>;
};
