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
import { BookmarkCheck, BookMarked, BookmarkIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { Action } from '@/types';

export default function UserModal({ user }: { user: UserProfile }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { currentUser, bookmarkUpdate, userDataPrivate, requestsUpdate } =
        useAuth();

    async function handleProfileMatchRequest(requestedmeCollectionID: string, myrequestedCollectionID: string, action: Action, state: RequestAction) {
        if (!currentUser) throw 'you must be logged in';
        await requestsUpdate(requestedmeCollectionID, myrequestedCollectionID, state, action);
    }


    async function handleBookMark(action: Action) {
        await bookmarkUpdate(user.id, action);
    }

    if (!currentUser) return <>loading</>
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

                                {user.status
                                    ? user.status == 'requestedMe'
                                        ? <>
                                            <Button
                                                color="Destructive"
                                                onClick={() => handleProfileMatchRequest(currentUser.uid, user.id, 'add', 'rejected')}//2nd argument is not required but have to pass, so keeping it rejected for the time
                                            >
                                                reject
                                            </Button>
                                            <Button
                                                color="Destructive"
                                                onClick={() => handleProfileMatchRequest(currentUser.uid, user.id, 'add', 'accepted')}//4th argument is not required but have to pass, so keeping it rejected for the time
                                            >
                                                Accept
                                            </Button>
                                        </>
                                        : (user.status == 'requested' && <Button
                                            color="Destructive"
                                            onClick={() => handleProfileMatchRequest(user.id, currentUser.uid, 'add', 'rejected')}//2nd argument is not required but have to pass, so keeping it rejected for the time
                                        >
                                            Cancel Request
                                        </Button>)
                                    : <Button
                                        color="primary"
                                        onClick={() => handleProfileMatchRequest(user.id, currentUser.uid, 'add', 'requested')}
                                    >
                                        Request
                                    </Button>}
                                {user.status == 'rejected' && <Button variant={"outline"} disabled className='text-destructive'>Rejected</Button>}
                                {user.status == 'accepted' && <Button variant={"secondary"} className='text-destructive'>Not moving Forward?</Button>}
                                {user.status == 'unmatched' && <Button variant={"secondary"} className='text-destructive'>Reconsider?</Button>}

                                {/* {buttonType ? (
                                    buttonType === 'myRequested' ? (
                                        <Button
                                            color="Destructive"
                                            onClick={() => handleProfileMatchRequest('add', "matched")}
                                        >
                                            accept
                                        </Button>
                                    ) : (
                                        buttonType === 'requestedMe' && (
                                            <>
                                                <Button
                                                    color="primary"
                                                    onClick={() => handleProfileMatchRequest('add')}
                                                >
                                                    Reject
                                                </Button>
                                                <Button
                                                    color="primary"
                                                    onClick={() => handleProfileMatchRequest('add')}
                                                >
                                                    Accept
                                                </Button>

                                            </>
                                        )
                                    )
                                ) : (
                                    <Button
                                        color="primary"
                                        onClick={() => handleProfileMatchRequest('add')}
                                    >
                                        Request
                                    </Button>
                                )} */}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
