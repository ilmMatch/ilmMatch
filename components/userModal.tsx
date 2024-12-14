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
import { UserProfile } from '@/types/firebase';
import { BookmarkCheck, BookMarked, BookmarkIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { Action } from '@/types';

export default function UserModal({
    user,
    buttonType,
}: {
    user: UserProfile;
    buttonType?: 'myRequested' | 'requestedMe';
}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const {
        currentUser,
        bookmarkUpdate,
        userDataPrivate,
        requestsUpdate,
    } = useAuth();

    async function handleProfileMatchRequest(action: Action) {
        if (!currentUser) throw 'you must be logged in';
        await requestsUpdate(user.id, currentUser.uid, 'requested', action);
    }
    async function handleBookMark(action: Action) {
        await bookmarkUpdate(user.id, action);
    }

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

                                {user.status ? (user.status == "requestedMe" ? "accept or reject" : "cancel Request") : "request"}

                                {/* {buttonType ? (
                                    buttonType === 'myRequested' ? (
                                        <Button
                                            color="Destructive"
                                            onClick={() => handleProfileMatchRequest('remove')}
                                        >
                                            Cancel Request
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
