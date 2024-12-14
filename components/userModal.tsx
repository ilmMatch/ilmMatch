'use client';
import React from 'react';
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
import { BookmarkCheck, BookmarkIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { Action } from '@/types';

export default function UserModal({ user }: { user: UserProfile }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { currentUser, bookmarkUpdate, userDataPrivate, requestsUpdate } =
        useAuth();

    async function handleProfileMatchRequest(
        requestedmeCollectionID: string,
        myrequestedCollectionID: string,
        action: Action,
        state: RequestAction
    ) {
        if (!currentUser) throw 'you must be logged in';
        await requestsUpdate(
            requestedmeCollectionID,
            myrequestedCollectionID,
            state,
            action
        );
    }

    async function handleBookMark(action: Action) {
        await bookmarkUpdate(user.id, action);
    }

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
                                    handleAction={handleProfileMatchRequest}
                                />
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

interface UserButtonStatusProps {
    status?: string;
    statusFrom?: string;
    currentUserUID: string;
    userUID: string;
    handleAction: (
        requestedmeCollectionID: string,
        myrequestedCollectionID: string,
        action: Action,
        state: RequestAction
    ) => Promise<void>;
}

const UserActionButtons: React.FC<UserButtonStatusProps> = ({ status, statusFrom, handleAction, currentUserUID, userUID }) => {

    const handleMyRequestsClick = (action: Action, state: RequestAction) => async () => {
        const requestedmeCollectionID = userUID
        const myrequestedCollectionID = currentUserUID

        await handleAction(
            requestedmeCollectionID,
            myrequestedCollectionID,
            action,
            state
        );
    };

    const handleRequestedMeClick = (action: Action, state: RequestAction) => async () => {
        const requestedmeCollectionID = currentUserUID;
        const myrequestedCollectionID = userUID;
        await handleAction(
            requestedmeCollectionID,
            myrequestedCollectionID,
            action,
            state
        );
    };

    if (!status && !statusFrom) {
        return (
            <Button onClick={handleMyRequestsClick('add', 'requested')} variant='default'>Request</Button>
        );
    }

    if (statusFrom === 'myrequests') {
        if (status === 'rejected') {
            return <Button variant='outline' className='text-destructive'>Rejected</Button>;
        }

        if (status === 'accepted') {
            return (
                <Button onClick={handleMyRequestsClick('add', 'unmatched')} variant='destructive'>
                    Not Moving Forward
                </Button>
            );
        }

        if (status === 'unmatched') {
            return (
                <Button onClick={handleMyRequestsClick('add', 'accepted')} variant='secondary'>
                    if still considering
                </Button>
            );
        }

        return (
            // requested and re-requested
            <Button onClick={handleMyRequestsClick('remove', 'requested')} variant='destructive'>
                Cancel Request
            </Button>
        );
    }

    {
        // user.status  : "requested" | "accepted" | "rejected" | "unmatched" | "re-requested"
        // user.statusFrom : "myrequests" | "requestedMe"
        // --- if both undefined then show "request"
        // --- if user.statusFrom == "myrequests" then show "cancel request"
        // --- --- and if status is rejected then show "rejected" ONLY
        // --- --- and if status is accepted then show "not moving forward"
        // --- --- and if status is unmatched then show "re-request"
        // --- if statusFrom == "requestedMe" then show "reject" and "accept"
        // --- --- and if status is rejected then show "rejected" and (reconsider)
        // --- --- and if status is accepted then show "not moving forward"
        // --- --- and if status is unmatched then show "re-request"
    }

    if (statusFrom === 'requestedMe') {
        if (status === 'rejected') {
            return (
                <>
                    <Button onClick={handleRequestedMeClick('add', 'accepted')} variant='default'> {/* // Re-request */}
                        Reconsider
                    </Button>
                </>
            );
        }

        if (status === 'accepted') {
            return (
                <Button onClick={handleRequestedMeClick('add', 'unmatched')} variant='destructive'>
                    Not Moving Forward?
                </Button>
            );
        }

        if (status === 'unmatched') {
            return (
                <Button onClick={handleRequestedMeClick('add', 'accepted')} variant='secondary'>
                    if still considering
                </Button>
            );
        }

        return (
            // requested and re-requested
            <>
                <Button onClick={handleRequestedMeClick('add', 'rejected')} variant='destructive' >Reject</Button>
                <Button onClick={handleRequestedMeClick('add', 'accepted')} variant='default' >Accept</Button>
            </>
        );
    }

    if (statusFrom === 'matched') {
        return (
            <Button onClick={handleRequestedMeClick('add', 'unmatched')} variant='destructive'>
                Not Moving Forward?
            </Button>
        );
    }
    return null;
};
